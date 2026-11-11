from app.services.chunking import MAX_WORDS, chunk_record


def rec(section, title, text):
    return {"id": f"x-s{section}", "act": "Test Act", "year": 2020, "chapter": "I",
            "section": section, "title": title, "text": text}


def test_short_section_is_one_chunk():
    chunks = chunk_record(rec("5", "Objects", "The objects of the Council shall be to advise."))
    assert len(chunks) == 1
    c = chunks[0]
    assert c["cite"] == "5"
    assert c["act"] == "Test Act" and c["section"] == "5"
    assert c["index_text"].startswith("Test Act 2020, Section 5 — Objects.")


def test_definitions_split_one_per_term():
    intro = "In this Act, unless the context otherwise requires,—"
    defs = [f"({i}) “term{i}” means " + "word " * 60 for i in range(1, 9)]
    defs.insert(3, "(i) a sub-item that belongs to definition 3")
    chunks = chunk_record(rec("2", "Definitions", "\n".join([intro] + defs)))
    assert [c["cite"] for c in chunks] == [f"2({i})" for i in range(1, 9)]
    assert "sub-item" in chunks[2]["text"]  # sub-items stay with their definition
    assert all(c["section"] == "2" for c in chunks)


def test_long_section_split_into_bounded_chunks():
    paras = [f"({i}) " + "word " * 120 for i in range(1, 8)]
    chunks = chunk_record(rec("38", "Procedure", "\n".join(paras)))
    assert len(chunks) > 1
    assert all(len(c["text"].split()) <= MAX_WORDS for c in chunks)
    assert all(c["cite"] == "38" for c in chunks)
    assert " ".join(c["text"] for c in chunks).split() == "\n".join(paras).split()  # nothing lost
