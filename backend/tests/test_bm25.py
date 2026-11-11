from app.services.bm25 import BM25, tokenize


def test_tokenize_drops_stopwords_and_case():
    assert tokenize("The Refund of MY money") == ["refund", "money"]


def test_matching_document_ranks_first():
    docs = [
        "The Central Council shall meet every year.",
        "A complaint for refund of a defective product may be filed.",
        "Information officers shall respond within thirty days.",
    ]
    scores = BM25(docs).scores("refund for defective product")
    assert scores.index(max(scores)) == 1
    assert scores[0] == 0


def test_no_overlap_scores_zero():
    assert BM25(["alpha beta", "gamma delta"]).scores("zebra") == [0, 0]
