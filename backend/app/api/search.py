from typing import Literal

from fastapi import APIRouter, Query

from app.services.retriever import get_retriever

router = APIRouter()


@router.get("/search")
def search(
    q: str = Query(..., min_length=3, max_length=1000, description="The user's problem, in plain words"),
    k: int = Query(3, ge=1, le=10),
    mode: Literal["semantic", "hybrid", "keyword"] = "semantic",
) -> dict:
    """Return the top-k law sections (act + section + text) for a problem description."""
    return get_retriever().search(q, k=k, mode=mode)
