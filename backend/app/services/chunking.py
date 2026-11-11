"""Split section records into retrieval chunks.

Why chunk at all: one vector has to summarise its whole text. Section 2 of
the CPA (Definitions) is ~4,000 words; a single vector for it would be a
blur of 47 different definitions and match nothing well.

Rules:
- Short sections (most of them) stay as ONE chunk.
- "Definitions" sections: one chunk per defined term, cited as e.g. 2(7).
- Other long sections: group consecutive paragraphs up to ~MAX_WORDS.
Every chunk keeps act + section so answers can always cite the source.
"""

import re

MAX_WORDS = 300
SINGLE_CHUNK_LIMIT = 350

# '(7) “consumer” means ...'  or  '(h) “public authority” means ...'
DEFINITION_START = re.compile(r"^\((\w+)\)\s*[“\"]")


def words(text: str) -> int:
    return len(text.split())


def _group(paragraphs: list[str]) -> list[str]:
    """Greedily pack paragraphs into chunks of at most MAX_WORDS words."""
    chunks, cur = [], []
    for p in paragraphs:
        if cur and words(" ".join(cur + [p])) > MAX_WORDS:
            chunks.append("\n".join(cur))
            cur = []
        cur.append(p)
    if cur:
        chunks.append("\n".join(cur))
    return chunks


def _split_definitions(text: str) -> list[tuple[str | None, str]]:
    """Return (clause_label, text) per definition. The intro line is dropped."""
    out: list[tuple[str | None, list[str]]] = []
    for p in text.split("\n"):
        if m := DEFINITION_START.match(p):
            out.append((m.group(1), [p]))
        elif out:
            out[-1][1].append(p)  # sub-items (i), (ii) belong to the definition above
    return [(label, "\n".join(ps)) for label, ps in out]


def chunk_record(rec: dict) -> list[dict]:
    base = {k: rec[k] for k in ("act", "year", "chapter", "section", "title")}
    text = rec["text"]

    if words(text) <= SINGLE_CHUNK_LIMIT:
        pieces = [(None, text)]
    elif rec["title"].lower() == "definitions":
        pieces = _split_definitions(text)
    else:
        pieces = [(None, t) for t in _group(text.split("\n"))]

    chunks = []
    for i, (clause, t) in enumerate(pieces):
        cite = f"{rec['section']}({clause})" if clause else rec["section"]
        chunks.append(
            {
                **base,
                "id": f"{rec['id']}-c{i}",
                "cite": cite,  # what we show the user: "Section 2(7)"
                "text": t,
                # Text actually embedded / keyword-indexed: a short header gives
                # each chunk its context (which act, which section, its title).
                "index_text": f"{rec['act']} {rec['year']}, Section {cite} — {rec['title']}.\n{t}",
            }
        )
    return chunks
