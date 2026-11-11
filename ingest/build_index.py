"""Build the search index: chunk every act, embed each chunk once, save to disk.

Run from the repo root with the backend venv:
    backend/.venv/bin/python ingest/build_index.py

Output: data/index/index.json (chunks + their vectors). Rebuild whenever
data/processed/*.jsonl changes. Embedding happens only here; at query time
only the user's question is sent to the API.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))

from app.config import settings  # noqa: E402
from app.services.chunking import chunk_record  # noqa: E402
from app.services.embeddings import GeminiEmbedder  # noqa: E402


def main() -> None:
    chunks = []
    for path in sorted((ROOT / "data" / "processed").glob("*.jsonl")):
        for line in path.open(encoding="utf-8"):
            chunks += chunk_record(json.loads(line))
    print(f"{len(chunks)} chunks from {len({(c['act'], c['section']) for c in chunks})} sections")

    embedder = GeminiEmbedder(settings.gemini_api_key, settings.embedding_model, settings.embedding_dim)
    vectors = embedder.embed_documents([c["index_text"] for c in chunks])

    out = settings.index_path
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps(
            {
                "model": settings.embedding_model,
                "dim": settings.embedding_dim,
                "chunks": chunks,
                "vectors": [[round(x, 6) for x in v] for v in vectors],
            },
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    print(f"saved -> {out.relative_to(ROOT)} ({out.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
