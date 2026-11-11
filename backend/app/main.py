from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse

from app.api import health, search
from app.config import settings

app = FastAPI(title=settings.app_name)

app.include_router(health.router)
app.include_router(search.router)

DEMO_PAGE = Path(__file__).parent / "static" / "index.html"


@app.get("/", include_in_schema=False)
def demo_page() -> FileResponse:
    """Single-page demo UI (temporary until the React frontend, M5)."""
    return FileResponse(DEMO_PAGE)
