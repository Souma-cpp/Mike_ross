"""Grounded guidance with a fake LLM: citation checking, scope, and failure handling."""

import pytest
from fastapi.testclient import TestClient

from app.api import ask as ask_route
from app.main import app
from app.services.guidance import GuidanceService, build_sources, ground_check
from app.services.llm import LLMUnavailable


class FakeLLM:
    def __init__(self, reply=None, fail=False):
        self.reply, self.fail, self.calls, self.last_model = reply, fail, [], "fake-model"

    def generate_json(self, system, prompt, schema):
        self.calls.append(prompt)
        if self.fail:
            raise LLMUnavailable("down")
        return self.reply


def item(text, *cites):
    return {"text": text, "citations": list(cites)}


GOOD = {
    "in_scope": True,
    "situation": item("A defective phone is covered by consumer law.", "S1"),
    "rights": [item("You can file a complaint.", "S1"), item("Made-up right.", "S99")],
    "steps": [
        {**item("Keep your bill."), "general_tip": True},
        {**item("File within two years.", "[S2]"), "general_tip": False},
        {**item("Uncited legal claim."), "general_tip": False},
    ],
    "deadlines": [item("Under IPC 420 you have 3 years.", "S1")],
}


def test_ground_check_removes_unsupported_statements():
    answer, stats = ground_check(GOOD, {"S1", "S2"})
    assert [r["text"] for r in answer["rights"]] == ["You can file a complaint."]  # S99 doesn't exist
    assert [s["text"] for s in answer["steps"]] == ["Keep your bill.", "File within two years."]
    assert answer["steps"][1]["citations"] == ["S2"]  # "[S2]" normalised
    assert answer["deadlines"] == []  # mentions IPC -> removed
    assert stats == {"kept": 3, "removed": 3, "general_tips": 1}


def test_sources_include_procedure_playbook(retriever):
    sources, mode = build_sources(retriever, "my phone is broken")
    cites = {(s["act_name"], s["cite"]): s["origin"] for s in sources}
    assert mode == "semantic"
    assert ("Consumer Protection Act", "69") in cites  # limitation period always included
    assert [s["id"] for s in sources] == [f"S{i}" for i in range(1, len(sources) + 1)]


def test_ok_answer_only_cites_given_sources(retriever):
    out = GuidanceService(retriever, FakeLLM(GOOD)).ask("my phone is broken")
    assert out["status"] == "ok"
    ids = {s["id"] for s in out["sources"]}
    for section in ("rights", "steps", "deadlines"):
        for x in out["answer"][section]:
            assert set(x["citations"]) <= ids
    assert out["checks"]["removed"] == 3


def test_out_of_scope(retriever):
    llm = FakeLLM({"in_scope": False, "out_of_scope_reason": "Divorce falls under family law.",
                   "situation": item(""), "rights": [], "steps": [], "deadlines": []})
    out = GuidanceService(retriever, llm).ask("I want a divorce")
    assert out["status"] == "out_of_scope"
    assert "family law" in out["message"] and out["answer"] is None


def test_llm_down_still_returns_sections(retriever):
    out = GuidanceService(retriever, FakeLLM(fail=True)).ask("my phone is broken")
    assert out["status"] == "sections_only"
    assert out["sources"] and out["answer"] is None


def test_repeat_question_is_cached(retriever):
    llm = FakeLLM(GOOD)
    svc = GuidanceService(retriever, llm)
    svc.ask("My phone is broken")
    svc.ask("my  phone is BROKEN")
    assert len(llm.calls) == 1


@pytest.fixture
def client(retriever, monkeypatch):
    svc = GuidanceService(retriever, FakeLLM(GOOD))
    monkeypatch.setattr(ask_route, "get_guidance", lambda: svc)
    return TestClient(app)


def test_ask_endpoint(client):
    res = client.post("/ask", json={"query": "my phone is broken"})
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    assert client.post("/ask", json={"query": "a"}).status_code == 422
