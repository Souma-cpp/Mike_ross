"""Gemini embedding client (REST via urllib; no SDK needed).

An embedding turns text into a list of numbers (a vector) such that texts
with similar MEANING get similar vectors. That's what lets "my phone broke
in a week" match a section about "defective goods" with no shared words.

Runs on Google's servers, so it costs no local CPU. Queries and documents
use different task types (RETRIEVAL_QUERY / RETRIEVAL_DOCUMENT), which the
model is trained to use for search.
"""

import json
import math
import time
import urllib.error
import urllib.request

API = "https://generativelanguage.googleapis.com/v1beta/models"
BATCH = 90  # texts per request; the free tier allows 100 texts/minute in total


def _retry_delay(error_body: bytes) -> float:
    """Read the 'retryDelay' (e.g. "32s") that Google returns with a 429."""
    try:
        for d in json.loads(error_body)["error"].get("details", []):
            if "retryDelay" in d:
                return float(d["retryDelay"].rstrip("s"))
    except (ValueError, KeyError):
        pass
    return 60.0


def normalize(v: list[float]) -> list[float]:
    """Scale to length 1, so cosine similarity becomes a plain dot product."""
    n = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / n for x in v]


class GeminiEmbedder:
    def __init__(self, api_key: str, model: str, dim: int, timeout: float = 20):
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set in backend/.env")
        self.api_key, self.model, self.dim, self.timeout = api_key, model, dim, timeout

    def _embed(self, texts: list[str], task: str) -> list[list[float]]:
        body = {
            "requests": [
                {
                    "model": f"models/{self.model}",
                    "content": {"parts": [{"text": t}]},
                    "taskType": task,
                    "outputDimensionality": self.dim,
                }
                for t in texts
            ]
        }
        req = urllib.request.Request(
            f"{API}/{self.model}:batchEmbedContents",
            data=json.dumps(body).encode(),
            # Key goes in a header, not the URL, so it never shows up in logs.
            headers={"x-goog-api-key": self.api_key, "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            data = json.load(resp)
        return [normalize(e["values"]) for e in data["embeddings"]]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """Embed many texts, respecting the free-tier limit.

        Free tier: 100 texts per minute, and every text inside a batch counts.
        So we send batches of BATCH and, when told "429 Too Many Requests",
        wait the delay the API asks for and retry.
        """
        out = []
        for i in range(0, len(texts), BATCH):
            for attempt in range(6):
                try:
                    out += self._embed(texts[i : i + BATCH], "RETRIEVAL_DOCUMENT")
                    break
                except urllib.error.HTTPError as e:
                    if e.code != 429 or attempt == 5:
                        raise
                    delay = _retry_delay(e.read()) + 2
                    print(f"  rate-limited; waiting {delay:.0f}s ({len(out)}/{len(texts)} done)")
                    time.sleep(delay)
        return out

    def embed_query(self, text: str) -> list[float]:
        return self._embed([text], "RETRIEVAL_QUERY")[0]
