"""App settings, loaded from environment variables / the .env file.

pydantic-settings reads each field from an env var of the same name
(case-insensitive). Missing optional keys stay None, so the app still boots
before we have any API keys.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "NyaySetu"
    environment: str = "dev"

    # Filled in later milestones; optional so the app runs without them.
    gemini_api_key: str | None = None
    openai_api_key: str | None = None
    sarvam_api_key: str | None = None


settings = Settings()
