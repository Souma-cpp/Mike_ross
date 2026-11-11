"""BM25 keyword search, in plain Python.

BM25 is the classic search-engine ranking formula (used by Elasticsearch,
Lucene). A document scores higher when it contains the query's words, more
so for RARE words (idf) and with diminishing returns for repeats (k1),
adjusted for document length (b).
"""

import math
import re
from collections import Counter

STOPWORDS = set(
    """a an and are as at be by for from has have i in is it its me my of on or
    our so that the their them they this to was we were will with you your he
    she his her him do does did not can what how who when where which why""".split()
)


def tokenize(text: str) -> list[str]:
    return [t for t in re.findall(r"[a-z0-9]+", text.lower()) if t not in STOPWORDS]


class BM25:
    def __init__(self, docs: list[str], k1: float = 1.5, b: float = 0.75):
        self.k1, self.b = k1, b
        self.tfs = [Counter(tokenize(d)) for d in docs]
        self.lens = [sum(tf.values()) for tf in self.tfs]
        self.avg_len = sum(self.lens) / len(self.lens)
        df = Counter(term for tf in self.tfs for term in tf)
        n = len(docs)
        self.idf = {t: math.log(1 + (n - f + 0.5) / (f + 0.5)) for t, f in df.items()}

    def scores(self, query: str) -> list[float]:
        q = tokenize(query)
        out = []
        for tf, length in zip(self.tfs, self.lens):
            s = 0.0
            for t in q:
                if t in tf:
                    f = tf[t]
                    s += self.idf[t] * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * length / self.avg_len))
            out.append(s)
        return out
