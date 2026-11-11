from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.guidance import get_guidance

router = APIRouter()


class AskRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=2000, description="The user's problem, in plain words")


@router.post("/ask")
def ask(req: AskRequest) -> dict:
    """Plain-language guidance grounded in law sections, with citations.

    status: "ok" (guidance), "out_of_scope" (not covered yet),
    or "sections_only" (LLM unavailable; relevant sections only).
    """
    return get_guidance().ask(req.query)
