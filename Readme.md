# ⚡ Mike


Always pull and then have the changes locally and push in your own branch and raise a pull request that me or someone else will verify and then we will merge that to main . Main should be clean . 


## Running the backend (M0)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # fill keys later; not needed for M0
uvicorn app.main:app --reload # http://127.0.0.1:8000/health  (docs at /docs)
pytest                        # run tests
```
