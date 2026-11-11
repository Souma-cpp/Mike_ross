"""LLM client (Gemini, REST via urllib).

All LLM calls in NyaySetu go through `LLM.generate_json`, so the provider
can be swapped (OpenAI, Sarvam, ...) by writing another class with the same
method. Tests use a fake with the same method.

Reliability for a live demo: we try a list of models in order. If the main
model is slow or errors (timeouts, quota, overload), the next one is used.
"""

import json
import logging
import urllib.error
import urllib.request

API = "https://generativelanguage.googleapis.com/v1beta/models"
log = logging.getLogger(__name__)


class LLMUnavailable(Exception):
    """Every model in the chain failed."""


class GeminiLLM:
    def __init__(self, api_key: str, models: list[str], timeout: float = 20):
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set in backend/.env")
        self.api_key, self.models, self.timeout = api_key, models, timeout
        self.last_model: str | None = None  # which model answered (shown in the UI/logs)

    def _call(self, model: str, system: str, prompt: str, schema: dict) -> dict:
        body = {
            "systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {
                # Structured output: the model MUST return JSON matching `schema`,
                # so we never have to scrape an answer out of free text.
                "responseMimeType": "application/json",
                "responseSchema": schema,
                "temperature": 0.2,  # low = consistent, less "creative"
                "thinkingConfig": {"thinkingLevel": "low"},
            },
        }
        req = urllib.request.Request(
            f"{API}/{model}:generateContent",
            data=json.dumps(body).encode(),
            headers={"x-goog-api-key": self.api_key, "Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            data = json.load(resp)
        text = "".join(p.get("text", "") for p in data["candidates"][0]["content"]["parts"])
        return json.loads(text)

    def generate_json(self, system: str, prompt: str, schema: dict) -> dict:
        errors = []
        for model in self.models:
            try:
                out = self._call(model, system, prompt, schema)
                self.last_model = model
                return out
            except (urllib.error.URLError, TimeoutError, KeyError, IndexError, ValueError) as e:
                log.warning("LLM %s failed: %s", model, e)
                errors.append(f"{model}: {type(e).__name__}")
        raise LLMUnavailable("; ".join(errors))
