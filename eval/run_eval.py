"""Score retrieval on hand-written layperson queries.

Run from the repo root:
    backend/.venv/bin/python eval/run_eval.py

For each query we know which section(s) are correct. Metrics:
- Act@1   : top result is from the right act
- Hit@1   : top result is a correct section
- Hit@3   : a correct section is somewhere in the top 3
- MRR     : mean of 1/rank of the first correct section (1.0 = always first)
Compared across keyword-only, semantic-only and hybrid search.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))

from app.services.retriever import Retriever  # noqa: E402

MODES = ["keyword", "semantic", "hybrid"]


def main() -> None:
    queries = [json.loads(l) for l in (ROOT / "eval" / "queries.jsonl").open(encoding="utf-8")]
    r = Retriever()
    verbose = "-v" in sys.argv

    print(f"{len(queries)} queries\n")
    print(f"{'mode':<10} {'Act@1':>6} {'Hit@1':>6} {'Hit@3':>6} {'MRR':>6}")
    for mode in MODES:
        act1 = hit1 = hit3 = rr = 0.0
        misses = []
        for q in queries:
            res = r.search(q["q"], k=3, mode=mode)["results"]
            ranks = [
                i + 1
                for i, x in enumerate(res)
                if x["act"].startswith(q["act"]) and x["section"] in q["sections"]
            ]
            act1 += bool(res) and res[0]["act"].startswith(q["act"])
            hit1 += bool(ranks) and ranks[0] == 1
            hit3 += bool(ranks)
            rr += 1 / ranks[0] if ranks else 0
            if not ranks:
                misses.append((q, res))
        n = len(queries)
        print(f"{mode:<10} {act1 / n:>6.0%} {hit1 / n:>6.0%} {hit3 / n:>6.0%} {rr / n:>6.2f}")
        if verbose:
            for q, res in misses:
                got = ", ".join(f"{x['act'].split(',')[0][:3]} s{x['cite']}" for x in res)
                print(f"    MISS want {q['sections']}: {q['q'][:60]}...  got [{got}]")


if __name__ == "__main__":
    main()
