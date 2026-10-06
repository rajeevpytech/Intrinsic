"""Recover original baked-in uploads when a VPS lacks a storage object."""
import base64
import json
from functools import lru_cache
from pathlib import Path


@lru_cache(maxsize=1)
def _export_files(export_path: str):
    try:
        payload = json.loads(Path(export_path).read_text())
        if payload.get("signature") != "intrinsic-site-export":
            return {}
        return payload.get("files", {})
    except (OSError, ValueError):
        return {}


def recover_original(export_path: Path, storage_path: str):
    entry = _export_files(str(export_path)).get(storage_path)
    if not isinstance(entry, dict) or not entry.get("data"):
        return None
    return base64.b64decode(entry["data"], validate=True), entry.get("content_type", "application/octet-stream")
