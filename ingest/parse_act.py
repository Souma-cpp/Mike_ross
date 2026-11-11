"""Parse an India Code bare-act PDF into one record per section (JSONL).

Run from the repo root:
    python3 ingest/parse_act.py            # parses every act in ACTS
    python3 ingest/parse_act.py cpa        # just one

How it works (the short version for the viva):
1. `pdftohtml -xml` (poppler) gives every piece of text with its position
   and font. Plain text extraction loses that information.
2. Noise is removed by FONT, not by guessing from words:
   - body text is ~17pt; footnotes (amendment history) are ~14pt -> a line
     made only of small text is a footnote and is dropped
   - the diagonal "India Code" watermark is 45pt grey Helvetica -> dropped
   - page numbers are in Calibri -> dropped
3. Section headings are bold and look like "35. Manner in which ...—".
   We only accept a heading whose number is greater than the previous
   one, so a stray "1. ..." can't start a fake section.
4. Validation: report missing section numbers, so we know the dataset is
   complete instead of hoping it is.

Standard library only; needs `pdftohtml` (package poppler-utils).
"""

import html
import json
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data" / "processed"

# One entry per act. `expected_last` is the last section number of the act,
# used by validation.
ACTS = {
    "cpa": {
        "file": "consumer_protection_act.pdf",
        "act": "Consumer Protection Act",
        "year": 2019,
        "expected_last": 107,
    },
    "rti": {
        "file": "right_to_information_act.pdf",
        "act": "Right to Information Act",
        "year": 2005,
        "expected_last": 31,
    },
}

BODY_MIN_SIZE = 16  # pt; smaller = footnote / superscript
WATERMARK_MIN_SIZE = 40

SECTION_RE = re.compile(r"^(\d+)([A-Z]{0,2})\.\s*(.*)$")
CHAPTER_RE = re.compile(r"^CHAPTER\s+([IVXLC]+[A-Z]?)\b")
SCHEDULE_RE = re.compile(r"^THE\s+(FIRST\s+|SECOND\s+|THIRD\s+)?SCHEDULE", re.I)


@dataclass
class Piece:
    page: int
    top: int
    left: int
    size: int
    family: str
    bold: bool
    text: str


@dataclass
class Line:
    text: str
    starts_bold: bool  # first non-blank piece is bold -> candidate heading


def read_pieces(pdf: Path) -> list[Piece]:
    """Run pdftohtml -xml and return every text piece with its font info."""
    with tempfile.TemporaryDirectory() as tmp:
        stem = Path(tmp) / "out"
        subprocess.run(
            ["pdftohtml", "-xml", "-i", "-q", "-nodrm", str(pdf), str(stem)],
            check=True,
        )
        xml = (stem.with_suffix(".xml")).read_text(encoding="utf-8")

    fonts = {
        m["id"]: (int(m["size"]), m["family"])
        for m in re.finditer(r'<fontspec id="(?P<id>\d+)" size="(?P<size>\d+)" family="(?P<family>[^"]+)"', xml)
    }
    pieces = []
    for page_m in re.finditer(r'<page number="(\d+)".*?</page>', xml, re.S):
        page = int(page_m.group(1))
        for t in re.finditer(
            r'<text top="(\d+)" left="(\d+)"[^>]*font="(\d+)">(.*?)</text>', page_m.group(0), re.S
        ):
            size, family = fonts[t.group(3)]
            raw = t.group(4)
            pieces.append(
                Piece(
                    page=page,
                    top=int(t.group(1)),
                    left=int(t.group(2)),
                    size=size,
                    family=family,
                    bold="<b>" in raw,
                    text=html.unescape(re.sub(r"<[^>]+>", "", raw)),
                )
            )
    return pieces


def is_noise(p: Piece) -> bool:
    return p.size >= WATERMARK_MIN_SIZE or "Calibri" in p.family


def to_lines(pieces: list[Piece]) -> list[Line]:
    """Group pieces into visual lines; drop lines that are entirely footnote-sized."""
    pieces = [p for p in pieces if not is_noise(p)]
    pieces.sort(key=lambda p: (p.page, p.top, p.left))

    groups: list[list[Piece]] = []
    for p in pieces:
        last = groups[-1] if groups else None
        if last and last[0].page == p.page and abs(last[0].top - p.top) <= 4:
            last.append(p)
        else:
            groups.append([p])

    lines = []
    for g in groups:
        g.sort(key=lambda p: p.left)
        if not any(p.size >= BODY_MIN_SIZE and p.text.strip() for p in g):
            continue  # footnote line
        # Keep small text that sits on a body line (small caps in headings),
        # but drop tiny superscript footnote markers (< 13pt).
        text = "".join(p.text for p in g if p.size >= 13)
        text = re.sub(r"\s+", " ", text).strip()
        if not text:
            continue
        # A heading counts as bold if any of its first few pieces is bold:
        # the PDF sometimes splits "10." into a plain "1" + bold "0.".
        head = [p for p in g if p.text.strip()][:3]
        lines.append(Line(text=text, starts_bold=any(p.bold for p in head)))
    return lines


def join_text(lines: list[str]) -> str:
    """Join wrapped lines; start a new paragraph at '(1)', '(a)', 'Explanation'."""
    out = ""
    for ln in lines:
        if not out:
            out = ln
        elif re.match(r"^(\(\w{1,5}\)|Explanation|Illustration|Provided)", ln):
            out += "\n" + ln
        elif out.endswith("-"):
            out += ln
        else:
            out += " " + ln
    return out.strip()


def parse(key: str) -> list[dict]:
    cfg = ACTS[key]
    lines = to_lines(read_pieces(RAW / cfg["file"]))

    # Skip the cover page and "Arrangement of Sections" (the table of contents).
    start = next(i for i, l in enumerate(lines) if l.text.startswith("BE it enacted"))
    lines = lines[start + 1 :]

    records: list[dict] = []
    chapter = None
    current = None  # {"section", "title", "body": [...]}
    last_num = 0

    def flush():
        if current:
            records.append(
                {
                    "id": f"{key}-s{current['section']}",
                    "act": cfg["act"],
                    "year": cfg["year"],
                    "chapter": current["chapter"],
                    "section": current["section"],
                    "title": current["title"],
                    "text": join_text(current["body"]),
                    "source": "India Code (indiacode.nic.in)",
                }
            )

    i = 0
    while i < len(lines):
        line = lines[i]
        text = line.text

        if SCHEDULE_RE.match(text):
            break  # schedules are out of scope for the demo

        if m := CHAPTER_RE.match(text):
            chapter = m.group(1)
            i += 2  # skip the chapter-title line that follows
            continue

        m = SECTION_RE.match(text)
        if m and line.starts_bold and int(m.group(1)) > last_num - (1 if m.group(2) else 0):
            # A heading may wrap onto the next line(s) before the "—".
            head = m.group(3)
            j = i
            while "—" not in head and j + 1 < len(lines) and j - i < 3:
                j += 1
                head += " " + lines[j].text
            title, _, rest = head.partition("—")
            flush()
            last_num = int(m.group(1))
            current = {
                "section": m.group(1) + m.group(2),
                "title": title.strip().rstrip(".").strip(),
                "chapter": chapter,
                "body": [rest.strip()] if rest.strip() else [],
            }
            i = j + 1
            continue

        if current:
            current["body"].append(text)
        i += 1

    flush()
    return records


def validate(key: str, records: list[dict]) -> list[str]:
    """Return a list of problems; empty means the act looks complete."""
    problems = []
    nums = sorted({int(re.match(r"\d+", r["section"]).group()) for r in records})
    expected = set(range(1, ACTS[key]["expected_last"] + 1))
    if missing := sorted(expected - set(nums)):
        problems.append(f"missing sections: {missing}")
    if extra := sorted(set(nums) - expected):
        problems.append(f"unexpected section numbers: {extra}")
    for r in records:
        if len(r["text"]) < 20 and "omitted" not in r["text"].lower() and "omitted" not in r["title"].lower():
            problems.append(f"suspiciously short text in section {r['section']}: {r['text']!r}")
    return problems


def main(keys: list[str]) -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    ok = True
    for key in keys:
        records = parse(key)
        path = OUT / f"{key}.jsonl"
        with path.open("w", encoding="utf-8") as f:
            for r in records:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        problems = validate(key, records)
        status = "OK" if not problems else "CHECK"
        print(f"[{status}] {ACTS[key]['act']} {ACTS[key]['year']}: {len(records)} sections -> {path.relative_to(ROOT)}")
        for p in problems:
            print("    -", p)
        ok &= not problems
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or list(ACTS)))
