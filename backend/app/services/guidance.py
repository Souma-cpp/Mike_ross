"""Grounded guidance: retrieved law sections -> plain-language advice with citations.

Pipeline for one question:
1. RETRIEVE  the top sections for the user's problem (semantic search).
2. ADD       the act's core procedure sections ("playbook"): how to file,
             where, and the deadline. Search alone finds the section about
             *the problem* (e.g. defective goods) but not *what to do next*.
3. GENERATE  structured JSON with an LLM that may use ONLY those sections,
             citing them by id (S1, S2, ...).
4. CHECK     every statement: citations must point to sources we actually
             gave the model; uncited legal statements are removed. The model
             can't slip in a section from memory (e.g. an old IPC number).
If the LLM is unavailable, we still return the sections (search-only mode).
"""

import logging
import re

from app.config import settings
from app.services.llm import GeminiLLM, LLMUnavailable
from app.services.retriever import Retriever, get_retriever

log = logging.getLogger(__name__)

TOP_K = 5
MAX_SOURCES = 9

# Core procedure sections per act: how to complain / where / deadline / outcomes.
PLAYBOOK = {
    "Consumer Protection Act": ["35", "34", "69", "39"],
    "Right to Information Act": ["6", "7", "19"],
}

COVERED = "Consumer Protection Act, 2019 and Right to Information Act, 2005"

SYSTEM = """You are NyaySetu, a legal information assistant for ordinary people in India.
You get the user's problem and numbered SOURCES: sections of Indian Acts.

Rules:
1. Use ONLY the sources for legal statements. Every legal statement lists the ids of the
   sources that support it in `citations` (e.g. ["S2"]). Never cite a source that does not
   support the statement.
2. No outside legal knowledge: do not mention any act, section, amount, deadline, fee or
   authority that is not in the sources. Never mention the IPC.
3. If the sources do not address the user's problem, set in_scope=false, leave the lists
   empty, and give a one-sentence out_of_scope_reason addressed to the user, naming the
   area of law their problem belongs to (e.g. "Divorce and domestic violence fall under
   family law."). Do not mention "sources".
4. Write for a layperson: short sentences, simple English, address the user as "you".
   Avoid legal jargon; if you must use a legal term, explain it in a few words.
5. steps = concrete actions in order. A step that is common-sense practical advice and not a
   legal statement (e.g. "keep your bill and photos of the defect") sets general_tip=true and
   may have no citations. At most 2 general tips.
6. Do not promise outcomes. Say what the law allows or what an authority can order.
   Lead with the most direct, practical remedy for the user's actual situation; mention
   other routes only if they clearly fit the facts the user gave.
7. Be brief: situation 1-3 sentences; 2-4 rights; 3-5 steps; deadlines only if a source
   states one."""

_ITEM = {
    "type": "OBJECT",
    "properties": {
        "text": {"type": "STRING"},
        "citations": {"type": "ARRAY", "items": {"type": "STRING"}},
    },
    "required": ["text", "citations"],
}
SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "in_scope": {"type": "BOOLEAN"},
        "out_of_scope_reason": {"type": "STRING"},
        "situation": _ITEM,
        "rights": {"type": "ARRAY", "items": _ITEM},
        "steps": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "text": {"type": "STRING"},
                    "citations": {"type": "ARRAY", "items": {"type": "STRING"}},
                    "general_tip": {"type": "BOOLEAN"},
                },
                "required": ["text", "citations", "general_tip"],
            },
        },
        "deadlines": {"type": "ARRAY", "items": _ITEM},
    },
    "required": ["in_scope", "situation", "rights", "steps", "deadlines"],
    "propertyOrdering": ["in_scope", "out_of_scope_reason", "situation", "rights", "steps", "deadlines"],
}


def build_sources(retriever: Retriever, query: str) -> tuple[list[dict], str]:
    """Steps 1+2: retrieved sections + playbook sections, numbered S1..Sn."""
    found = retriever.search(query, k=TOP_K, mode="semantic")
    sources: list[dict] = []
    seen: set[tuple[str, str]] = set()

    def add(src: dict, origin: str) -> None:
        key = (src["act_name"], src["cite"])
        if key in seen or len(sources) >= MAX_SOURCES:
            return
        seen.add(key)
        sources.append({**src, "id": f"S{len(sources) + 1}", "origin": origin})

    for r in found["results"]:
        # Definitions: keep just the matching definition, e.g. 2(7); else the whole section.
        whole = None if "(" in r["cite"] else retriever.section(r["act_name"], r["section"])
        add({k: v for k, v in (whole or r).items() if k not in ("score", "similarity")}, "search")

    for act in dict.fromkeys(r["act_name"] for r in found["results"][:3]):
        for sec in PLAYBOOK.get(act, []):
            if s := retriever.section(act, sec):
                add(s, "procedure")
    return sources, found["mode"]


def format_prompt(query: str, sources: list[dict]) -> str:
    blocks = [f"[{s['id']}] {s['act']}, Section {s['cite']} — {s['title']}\n{s['text']}" for s in sources]
    return f"USER'S PROBLEM:\n{query}\n\nSOURCES:\n\n" + "\n\n".join(blocks)


def _clean_ids(ids: list[str], valid: set[str]) -> list[str]:
    out = []
    for raw in ids:
        sid = re.sub(r"[^S0-9]", "", raw.upper())
        if sid in valid and sid not in out:
            out.append(sid)
    return out


def ground_check(answer: dict, valid: set[str]) -> tuple[dict, dict]:
    """Step 4: keep only statements backed by real sources. Returns (answer, stats)."""
    stats = {"kept": 0, "removed": 0, "general_tips": 0}

    def keep(item: dict, tip_allowed: bool = False) -> dict | None:
        item = {**item, "citations": _clean_ids(item.get("citations", []), valid)}
        text = item.get("text", "").strip()
        is_tip = tip_allowed and item.get("general_tip", False)
        if not text or re.search(r"\bIPC\b|Indian Penal Code", text):
            stats["removed"] += 1
            return None
        if is_tip:
            stats["general_tips"] += 1
            return {**item, "text": text}
        if not item["citations"]:
            stats["removed"] += 1
            return None
        stats["kept"] += 1
        return {**item, "text": text, "general_tip": False}

    out = {
        "situation": keep(answer.get("situation") or {}),
        "rights": [x for x in map(keep, answer.get("rights", [])) if x],
        "steps": [x for x in (keep(s, tip_allowed=True) for s in answer.get("steps", [])) if x],
        "deadlines": [x for x in map(keep, answer.get("deadlines", [])) if x],
    }
    return out, stats


class GuidanceService:
    def __init__(self, retriever: Retriever, llm):
        self.retriever, self.llm = retriever, llm
        self._cache: dict[str, dict] = {}  # identical demo questions answer instantly

    def ask(self, query: str) -> dict:
        key = " ".join(query.lower().split())
        if key in self._cache:
            return self._cache[key]

        sources, search_mode = build_sources(self.retriever, query)
        result = {"query": query, "search_mode": search_mode, "sources": sources,
                  "answer": None, "checks": None, "model": None}

        if not sources:
            return {**result, "status": "out_of_scope",
                    "message": f"I couldn't find anything relevant. NyaySetu currently covers the {COVERED}."}
        if self.llm is None:
            return {**result, "status": "sections_only",
                    "message": "Guidance is unavailable (no API key), showing the relevant sections."}

        try:
            raw = self.llm.generate_json(SYSTEM, format_prompt(query, sources), SCHEMA)
        except LLMUnavailable as e:
            log.warning("guidance unavailable: %s", e)
            return {**result, "status": "sections_only",
                    "message": "Couldn't generate guidance right now, so here are the most relevant sections."}

        if not raw.get("in_scope", False):
            reason = raw.get("out_of_scope_reason") or "This doesn't seem to be covered yet."
            return {**result, "status": "out_of_scope", "sources": [],
                    "message": f"{reason} NyaySetu currently covers the {COVERED}."}

        answer, checks = ground_check(raw, {s["id"] for s in sources})
        if not (answer["rights"] or answer["steps"]):
            return {**result, "status": "sections_only",
                    "message": "I couldn't build guidance fully supported by the law text, so here are the relevant sections."}

        out = {**result, "status": "ok", "answer": answer, "checks": checks,
               "model": getattr(self.llm, "last_model", None), "message": None}
        self._cache[key] = out
        return out


_service: GuidanceService | None = None


def get_guidance() -> GuidanceService:
    global _service
    if _service is None:
        llm = (
            GeminiLLM(settings.gemini_api_key, [settings.llm_model, settings.llm_fallback_model])
            if settings.gemini_api_key
            else None
        )
        _service = GuidanceService(get_retriever(), llm)
    return _service
