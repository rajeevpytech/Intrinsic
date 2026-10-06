"""Database-backed public-site CSS, separate from global theme settings."""
from datetime import datetime
from typing import Literal

import tinycss2
from fastapi import HTTPException
from pydantic import BaseModel, ConfigDict, Field

from typography import BaseDocument


class CustomCssInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    css: str = Field(max_length=50000)


class CustomCssPublic(BaseModel):
    css: str = ""
    updated_at: datetime | None = None


class CustomCssDocument(BaseDocument, CustomCssPublic):
    key: Literal["custom_css"] = "custom_css"


def validate_custom_css(css: str):
    if "<style" in css.lower() or "</style" in css.lower() or "<script" in css.lower():
        raise HTTPException(status_code=422, detail="Enter CSS only, without HTML or <style> tags.")
    tokens = list(tinycss2.parse_stylesheet(css, skip_comments=True, skip_whitespace=True))
    while tokens:
        token = tokens.pop()
        if token.type == "error":
            raise HTTPException(status_code=422, detail=f"CSS error on line {token.source_line}, column {token.source_column}: {token.message}")
        tokens.extend(getattr(token, "content", None) or [])
        tokens.extend(getattr(token, "arguments", None) or [])
