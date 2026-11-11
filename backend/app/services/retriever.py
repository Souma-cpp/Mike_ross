"""Retrieval over the law chunks.

DEFAULT = semantic (embeddings). Keyword (BM25) is the offline fallback.
Hybrid (both, fused with RRF) is kept for comparison. On our eval set
(eval/run_eval.py, 21 layperson queries) semantic got Hit@3 100% while
hybrid got 81%: laypeople rarely use the statute's own words ("RTI" never
appears in the RTI Act), so keyword rankings pulled good results down.

The idea behind hybrid, for reference:
- Keywords nail exact terms ("mediation", "refund").
- Embeddings catch paraphrases ("broken phone" -> "defect in goods").
Each misses things the other finds, so we combine their rankings.

Reciprocal Rank Fusion (RRF): every chunk gets  sum of 1 / (60 + rank)
over the rankings it appears in. It uses only ranks, so we never have to
compare a BM25 score with a cosine similarity (different scales).

If the embedding API is unreachable (no internet during the demo), we fall
back to keyword-only instead of failing.
"""

import json
import logging
from functools import lru_cache

from app.config import settings
from app.services.bm25 import BM25
from app.services.embeddings import GeminiEmbedder

log = logging.getLogger(__name__)

RRF_K = 60
CANDIDATES = 30  # how deep into each ranking we look


def _ranked(scores: list[float]) -> list[int]:
    order = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    return [i for i in order[:CANDIDATES] if scores[i] > 0]


class Retriever:
    def __init__(self, index_path=settings.index_path):
        data = json.loads(index_path.read_text(encoding="utf-8"))
        self.chunks = data["chunks"]
        self.vectors = data["vectors"]
        self.bm25 = BM25([c["index_text"] for c in self.chunks])
        # (act, section) -> its chunks in order, to rebuild a whole section's text
        self.by_section: dict[tuple[str, str], list[dict]] = {}
        for c in self.chunks:
            self.by_section.setdefault((c["act"], c["section"]), []).append(c)
        self.embedder = (
            GeminiEmbedder(settings.gemini_api_key, data["model"], data["dim"], timeout=8)
            if settings.gemini_api_key
            else None
        )

    @lru_cache(maxsize=256)  # repeat demo queries don't hit the API again
    def _query_vector(self, query: str) -> tuple[float, ...]:
        return tuple(self.embedder.embed_query(query))

    def _similarities(self, query: str) -> list[float]:
        """Cosine similarity of the query with every chunk (vectors are unit length)."""
        q = self._query_vector(query)
        return [sum(a * b for a, b in zip(q, v)) for v in self.vectors]

    def section(self, act: str, section: str) -> dict | None:
        """Whole section (all its chunks joined), e.g. section("Consumer Protection Act", "69")."""
        chunks = self.by_section.get((act, section))
        if not chunks:
            return None
        c = chunks[0]
        return {
            "act": f"{c['act']}, {c['year']}",
            "act_name": c["act"],
            "section": c["section"],
            "cite": c["section"],
            "title": c["title"],
            "chapter": c["chapter"],
            "text": "\n".join(ch["text"] for ch in chunks),
        }

    def search(self, query: str, k: int = 3, mode: str = "semantic") -> dict:
        """mode: 'hybrid' | 'semantic' | 'keyword'. Returns top-k SECTIONS."""
        rankings = []
        sims: list[float] | None = None
        used = mode
        if mode in ("hybrid", "keyword"):
            rankings.append(_ranked(self.bm25.scores(query)))
        if mode in ("hybrid", "semantic"):
            try:
                if not self.embedder:
                    raise RuntimeError("no GEMINI_API_KEY")
                sims = self._similarities(query)
                rankings.append(_ranked(sims))
            except Exception as e:  # network down, quota, etc.
                log.warning("embedding failed (%s); falling back to keyword search", e)
                if mode == "semantic":
                    rankings.append(_ranked(self.bm25.scores(query)))
                used = "keyword (fallback)"

        fused: dict[int, float] = {}
        for ranking in rankings:
            for rank, idx in enumerate(ranking):
                fused[idx] = fused.get(idx, 0.0) + 1 / (RRF_K + rank + 1)

        # Several chunks can come from the same section (e.g. many definitions).
        # Report each section once, using its best-scoring chunk as the evidence.
        results, seen = [], set()
        for idx in sorted(fused, key=fused.get, reverse=True):
            c = self.chunks[idx]
            key = (c["act"], c["section"])
            if key in seen:
                continue
            seen.add(key)
            results.append(
                {
                    "act": f"{c['act']}, {c['year']}",
                    "act_name": c["act"],
                    "section": c["section"],
                    "cite": c["cite"],
                    "title": c["title"],
                    "chapter": c["chapter"],
                    "text": c["text"],
                    "score": round(fused[idx], 4),
                    # raw cosine similarity (semantic modes only); used as a relevance gate
                    "similarity": round(sims[idx], 4) if sims else None,
                }
            )
            if len(results) == k:
                break
        return {"query": query, "mode": used, "results": results}


@lru_cache(maxsize=1)
def get_retriever() -> Retriever:
    return Retriever()
