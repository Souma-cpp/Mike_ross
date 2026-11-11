"""Shared test fixtures: a tiny fake law index + fake embedder (no API key needed)."""

import json
import urllib.error

import pytest

from app.services.chunking import chunk_record
from app.services.retriever import Retriever


def _rec(key, act, year, section, title, text):
    return {"id": f"{key}-s{section}", "act": act, "year": year, "chapter": "I",
            "section": section, "title": title, "text": text}


CPA, RTI = "Consumer Protection Act", "Right to Information Act"
RECORDS = [
    _rec("cpa", CPA, 2019, "35", "Manner in which complaint shall be made",
         "A complaint in relation to defective goods may be filed with the District Commission."),
    _rec("cpa", CPA, 2019, "69", "Limitation period",
         "The District Commission shall not admit a complaint unless it is filed within two years."),
    _rec("rti", RTI, 2005, "6", "Request for obtaining information",
         "A person who desires to obtain any information shall make a request in writing."),
]


def fake_vector(text: str) -> list[float]:
    """2-D 'embedding': points at consumer stuff or information stuff."""
    t = text.lower()
    return [1.0, 0.0] if any(w in t for w in ("complaint", "broken", "defective", "limitation")) else [0.0, 1.0]


class FakeEmbedder:
    def embed_query(self, text):
        return fake_vector(text)


class OfflineEmbedder:
    def embed_query(self, text):
        raise urllib.error.URLError("network down")


@pytest.fixture
def retriever(tmp_path):
    chunks = [c for r in RECORDS for c in chunk_record(r)]
    path = tmp_path / "index.json"
    path.write_text(json.dumps({"model": "fake", "dim": 2, "chunks": chunks,
                                "vectors": [fake_vector(c["index_text"]) for c in chunks]}))
    r = Retriever(index_path=path)
    r.embedder = FakeEmbedder()
    return r
