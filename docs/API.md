# Backend API (for frontend developers)

Base URL in development: `http://127.0.0.1:8000`. Interactive docs: `/docs`.
Start the backend: `cd backend && .venv/bin/uvicorn app.main:app --reload`.

## `POST /ask` — guidance for a problem (main endpoint)

Request:

```json
{ "query": "My new phone stopped working in a week and the seller refuses to replace it" }
```

`query`: 3–2000 characters. Shorter or missing -> `422`. Takes ~3–8 s; show a loading state.

Response (always `200` for a valid request; check `status`):

```jsonc
{
  "query": "...",
  "status": "ok",                 // "ok" | "out_of_scope" | "sections_only"
  "message": null,                // user-facing text when status != "ok"
  "answer": {                     // null unless status == "ok"
    "situation": { "text": "...", "citations": ["S2"] },          // may be null
    "rights":    [{ "text": "...", "citations": ["S1", "S4"] }],
    "steps":     [{ "text": "...", "citations": [], "general_tip": true }],
    "deadlines": [{ "text": "...", "citations": ["S8"] }]
  },
  "sources": [                    // the law the answer may cite; empty when out_of_scope
    {
      "id": "S1",                 // what `citations` refer to
      "act": "Consumer Protection Act, 2019",
      "act_name": "Consumer Protection Act",
      "section": "86",
      "cite": "86",               // display label, e.g. "2(10)" for a definition
      "title": "Liability of product sellers",
      "chapter": "VI",
      "text": "full section text",
      "origin": "search"          // "search" (matched the problem) | "procedure" (how to act)
    }
  ],
  "checks": { "kept": 8, "removed": 0, "general_tips": 1 },  // null unless ok
  "model": "gemini-3.5-flash",
  "search_mode": "semantic"       // "keyword (fallback)" when offline
}
```

How to render:

- `status == "ok"`: show situation / rights / steps / deadlines. For each id in
  `citations`, find the source with that `id` and show a chip like `§86`.
  `general_tip: true` steps are common-sense advice, not law: label them.
- `status == "out_of_scope"`: show `message` plus free legal aid info
  (NALSA helpline 15100 / District Legal Services Authority).
- `status == "sections_only"`: show `message` and the `sources` list.
- Always show the disclaimer: legal information, not legal advice.

## `GET /search?q=...&k=3` — matching sections only

Fast (~1 s). Returns `{ "query", "mode", "results": [ { act, act_name, section, cite, title, chapter, text, score, similarity } ] }`.

## `GET /health`

`{ "status": "ok", "keys_configured": { "gemini": true, ... } }`

## Running a separate frontend dev server

If the frontend runs on another port (e.g. Vite on 5173), the browser will block
requests to port 8000 (CORS). Ask the backend maintainer to enable CORS for that
origin, or use a dev-server proxy that forwards `/ask`, `/search`, `/health` to
`http://127.0.0.1:8000`.
