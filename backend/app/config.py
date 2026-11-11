"""App settings, loaded from environment variables / the .env file.

pydantic-settings reads each field from an env var of the same name
(case-insensitive). Missing optional keys stay None, so the app still boots
before we have any API keys.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = BACKEND_DIR.parent


class Settings(BaseSettings):
    # Absolute path, so scripts run from any folder still find backend/.env
    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    app_name: str = "NyaySetu"
    environment: str = "dev"

    # Filled in later milestones; optional so the app runs without them.
    gemini_api_key: str | None = None
    openai_api_key: str | None = None
    sarvam_api_key: str | None = None

    # Retrieval
    embedding_model: str = "gemini-embedding-2"
    embedding_dim: int = 768
    index_path: Path = REPO_ROOT / "data" / "index" / "index.json"

    # Guidance (LLM). The fallback is used if the main model is slow or fails.
    llm_model: str = "gemini-3.5-flash"
    llm_fallback_model: str = "gemini-3.5-flash-lite"


settings = Settings()
