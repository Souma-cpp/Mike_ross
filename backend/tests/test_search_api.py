"""/search end to end, with a tiny fake index and a fake embedder (no API key needed)."""

import json
import urllib.error

import pytest
from fastapi.testclient import TestClient

from app.api import search as search_route
from app.main import app
from app.services.chunking import chunk_record
from app.services.retriever import Retriever

RECORDS = [
    {"id": "cpa-s35", "act": "Consumer Protection Act", "year": 2019, "chapter": "IV", "section": "35",
     "title": "Manner in which complaint shall be made",
     "text": "A complaint in relation to defective goods may be filed with the District Commission."},
    {"id": "rti-s6", "act": "Right to Information Act", "year": 2005, "chapter": "II", "section": "6",
     "title": "Request for obtaining information",
     "text": "A person who desires to obtain any information shall make a request in writing."},
]


def fake_vector(text: str) -> list[float]:
    """2-D 'embedding': points at consumer stuff or information stuff."""
    t = text.lower()
    return [1.0, 0.0] if any(w in t for w in ("complaint", "broken", "defective")) else [0.0, 1.0]


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


@pytest.fixture
def client(retriever, monkeypatch):
    monkeypatch.setattr(search_route, "get_retriever", lambda: retriever)
    return TestClient(app)


def test_search_returns_act_and_section(client):
    res = client.get("/search", params={"q": "my phone is broken, seller won't help", "k": 1})
    assert res.status_code == 200
    body = res.json()
    assert body["mode"] == "semantic"
    top = body["results"][0]
    assert top["act"] == "Consumer Protection Act, 2019"
    assert top["section"] == "35"
    assert top["title"] and top["text"]


def test_falls_back_to_keyword_when_offline(client, retriever):
    retriever.embedder = OfflineEmbedder()
    body = client.get("/search", params={"q": "request for information in writing"}).json()
    assert body["mode"] == "keyword (fallback)"
    assert body["results"][0]["section"] == "6"


def test_rejects_too_short_query(client):
    assert client.get("/search", params={"q": "a"}).status_code == 422
