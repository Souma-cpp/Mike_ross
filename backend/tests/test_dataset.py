"""Guard the committed law dataset (data/processed/*.jsonl).

Reuses the parser's own validation, so a PR that drops or corrupts sections fails CI.
"""

import importlib.util
import json

import pytest

from app.config import REPO_ROOT

spec = importlib.util.spec_from_file_location("parse_act", REPO_ROOT / "ingest" / "parse_act.py")
parse_act = importlib.util.module_from_spec(spec)
spec.loader.exec_module(parse_act)

REQUIRED = {"id", "act", "year", "chapter", "section", "title", "text", "source"}


@pytest.mark.parametrize("key", sorted(parse_act.ACTS))
def test_act_dataset_is_complete(key):
    path = REPO_ROOT / "data" / "processed" / f"{key}.jsonl"
    assert path.exists(), f"{path.name} missing; run python3 ingest/parse_act.py {key}"
    records = [json.loads(line) for line in path.open(encoding="utf-8")]

    assert parse_act.validate(key, records) == []
    for r in records:
        assert REQUIRED <= r.keys(), f"section {r.get('section')} missing fields"
        assert r["act"] == parse_act.ACTS[key]["act"]
    assert len({r["id"] for r in records}) == len(records), "duplicate ids"
