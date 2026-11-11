from fastapi import APIRouter

from app.config import settings

router = APIRouter()


@router.get("/health")
def health() -> dict:
    """Liveness check. Also reports which API keys are configured (never the keys)."""
    return {
        "status": "ok",
        "app": settings.app_name,
        "environment": settings.environment,
        "keys_configured": {
            "gemini": bool(settings.gemini_api_key),
            "openai": bool(settings.openai_api_key),
            "sarvam": bool(settings.sarvam_api_key),
        },
    }
