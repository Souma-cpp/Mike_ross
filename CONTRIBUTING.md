# Contributing to NyaySetu

The goal: **`main` always runs.** Anyone can clone it, follow the README, and
get a working demo. Everything below exists to protect that.

## The workflow

```bash
# 1. Start from the latest main
git checkout main
git pull

# 2. Make a branch for ONE piece of work
git checkout -b <your-name>/<short-topic>      # e.g. riya/voice-input

# 3. Work, test, commit (small commits are fine)
cd backend && .venv/bin/pytest && cd ..
git add <files>
git commit -m "Add Sarvam speech-to-text endpoint"

# 4. Before pushing, catch up with main so your PR merges cleanly
git pull --rebase origin main

# 5. Push your branch (never main) and open a pull request on GitHub
git push -u origin <your-name>/<short-topic>
```

Then on GitHub:

1. Open a pull request into `main` and fill in the template.
2. The **`tests`** check runs automatically. It must be green.
3. Soumaditya reviews. Fix anything requested by pushing more commits to the same branch.
4. Soumaditya **squash-merges** it (your branch becomes one clean commit on `main`).
5. The branch is deleted automatically. Start your next piece of work from step 1.

Keep branches short-lived (days, not weeks). A big branch that lives for a
month is painful to merge.

## Naming

| Thing | Rule | Good | Bad |
|---|---|---|---|
| Branch | `<your-name>/<kebab-case-topic>` | `soumaditya/ipc-bns-mapping` | `test`, `new-branch`, `m3` |
| Commit / PR title | Imperative, says what changed | `Add RTI application template` | `changes`, `fix`, `M2 done` |
| Python files | `snake_case.py`, named after what they do | `retriever.py` | `utils2.py` |

No internal codes like "M0" or "phase 3" in names. Roadmap stages have real names in
[`docs/ROADMAP.md`](docs/ROADMAP.md).

## Where code goes

- **New HTTP endpoint** -> a route in `backend/app/api/`, registered in `backend/app/main.py`.
  Keep routes thin: they validate input and call a service.
- **Logic** (LLM calls, retrieval, document filling) -> `backend/app/services/`.
- **Offline data processing** (parsing PDFs, building indexes) -> `ingest/`.
- **Anything that calls an external API** (Gemini, Sarvam, ...) goes behind a small
  class in `services/` so tests can swap in a fake and the provider can be changed.
- **Tests** -> `backend/tests/test_<thing>.py`.

## Tests

```bash
cd backend && .venv/bin/pytest
```

- Tests must pass **without API keys and without the PDFs**. CI has neither.
  Use a fake object instead of calling a real API (see `tests/test_search_api.py`).
- Changing anything in search? Also run `backend/.venv/bin/python eval/run_eval.py`
  and put the before/after numbers in your PR description.

## Never commit

- `backend/.env` or any API key. If a key is ever committed, revoke it immediately.
- `data/raw/` (PDFs) and `data/index/` (generated). `.gitignore` already blocks them.

## Recipe: adding a new act

1. Download its PDF from [India Code](https://www.indiacode.nic.in) into `data/raw/`.
2. Add an entry to `ACTS` in `ingest/parse_act.py` (file name, act name, year, last section number).
3. `python3 ingest/parse_act.py <key>`. It must print `[OK]`. If it prints `CHECK`,
   fix the parser rather than the output.
4. Commit the new `data/processed/<key>.jsonl`.
5. Rebuild the index: `backend/.venv/bin/python ingest/build_index.py`.
6. Add a few test queries for the new act to `eval/queries.jsonl` and run the eval.
