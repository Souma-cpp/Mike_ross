"""/search end to end, with the fake index and embedder from conftest.py."""

import pytest
from fastapi.testclient import TestClient

from app.api import search as search_route
from app.main import app
from tests.conftest import OfflineEmbedder


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
    assert top["section"] in ("35", "69")
    assert top["title"] and top["text"]
    assert top["similarity"] is not None


def test_falls_back_to_keyword_when_offline(client, retriever):
    retriever.embedder = OfflineEmbedder()
    body = client.get("/search", params={"q": "request for information in writing"}).json()
    assert body["mode"] == "keyword (fallback)"
    assert body["results"][0]["section"] == "6"


def test_rejects_too_short_query(client):
    assert client.get("/search", params={"q": "a"}).status_code == 422
