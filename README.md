# NyaySetu

**NyaySetu** ("bridge to justice") helps ordinary people in India understand the
law that applies to their problem. A user describes their situation in plain
words; NyaySetu finds the relevant act and section, explains their rights, and
(later) drafts documents such as RTI applications and consumer complaints.

Final-year B.Tech CSE project, Sister Nivedita University (2027 batch).

> NyaySetu gives legal **information**, not legal advice.

## What works today

- **Law dataset:** Consumer Protection Act 2019 (107 sections) and RTI Act 2005
  (31 sections), parsed from India Code PDFs into one validated record per section.
- **Grounded guidance:** type a problem in plain English and get structured
  guidance (your situation, your rights, what to do, deadlines). Every legal
  statement cites a section that was actually retrieved; uncited statements are
  removed automatically. Out-of-scope questions are recognised and pointed to
  free legal aid. (`POST /ask`)
- **Law search:** the top matching sections for a problem (`GET /search`).
  Semantic search with Gemini embeddings; keyword search as an offline fallback.
- **Accuracy check:** 21 everyday-language test queries; the right section is in
  the top 3 for all of them (`eval/run_eval.py`).

What's next: [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Quickstart

Needs Python 3.12+ and `pdftohtml` (Ubuntu: `sudo apt install poppler-utils python3-venv`).

```bash
# 1. Backend environment
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # add GEMINI_API_KEY (free: https://aistudio.google.com/apikey)
pytest                          # should pass, even without a key
cd ..

# 2. Build the search index (once, or whenever data/processed changes; ~3 min on the free tier)
backend/.venv/bin/python ingest/build_index.py

# 3. Run the demo
cd backend && .venv/bin/uvicorn app.main:app --reload
# open http://127.0.0.1:8000   (API docs: http://127.0.0.1:8000/docs)
```

Optional:

```bash
python3 ingest/parse_act.py                    # re-parse PDFs in data/raw -> data/processed
backend/.venv/bin/python eval/run_eval.py -v   # measure search accuracy
```

## Repository map

| Path | What lives there |
|---|---|
| `backend/app/main.py` | FastAPI app: registers routes, serves the demo page |
| `backend/app/config.py` | Settings and API keys, read from `backend/.env` |
| `backend/app/api/` | HTTP routes only (`/health`, `/search`, `/ask`). Thin: they call services |
| `backend/app/services/` | The actual logic: chunking, embeddings, keyword search, retriever, LLM client, guidance |
| `backend/app/static/` | Single-page web UI (until the React frontend). `/?q=...` runs a question directly |
| `backend/tests/` | Automated tests; run on every pull request |
| `ingest/` | Offline data pipeline: PDF -> sections (`parse_act.py`), sections -> search index (`build_index.py`) |
| `data/raw/` | Source PDFs from India Code (not in git; download yourself) |
| `data/processed/` | The law dataset: one JSON line per section (in git) |
| `data/index/` | Generated search index (not in git; rebuild with `ingest/build_index.py`) |
| `data/mappings/` | Lookup tables, e.g. IPC -> BNS (planned) |
| `eval/` | Test queries with expected sections + the accuracy script |
| `frontend/` | React app (planned) |
| `docs/` | Roadmap (`ROADMAP.md`) and the API contract for frontend work (`API.md`) |

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before your first change. In short:
never commit to `main`; work on `<your-name>/<topic>` branches and open a pull request.
