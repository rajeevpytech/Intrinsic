"""Debounced regeneration of styled initial HTML after admin publishes content."""
import asyncio
import logging
import os
import shutil
from pathlib import Path

logger = logging.getLogger("styled_refresh")
ROOT_DIR = Path(__file__).resolve().parent
SCRIPT = ROOT_DIR.parent / "frontend" / "scripts" / "prerender-styled.cjs"
TOOLS = Path(os.environ.get("STYLED_PRERENDER_TOOLS") or "/var/cache/intrinsic-prerender")
DELAY = float(os.environ.get("STYLED_REFRESH_DELAY") or 20)

# Admin writes that change public pages.
PUBLISH_PREFIXES = ("/api/live-edits", "/api/live-blocks", "/api/content/", "/api/content-site", "/api/theme",
                    "/api/custom-css", "/api/seo", "/api/admin/import", "/api/typography")
PUBLISH_EXCLUDE = ("/api/custom-css/validate",)

_state = {"task": None, "running": False, "again": False}


def is_publish(method: str, path: str) -> bool:
    return method in ("POST", "PUT", "PATCH", "DELETE") and path.startswith(PUBLISH_PREFIXES) and not path.startswith(PUBLISH_EXCLUDE)


def enabled() -> bool:
    return (os.environ.get("STYLED_REFRESH", "1") != "0" and SCRIPT.is_file()
            and (TOOLS / "node_modules" / "playwright").is_dir() and shutil.which("node") is not None)


async def _run(build_dir: Path, api_origin: str):
    env = {**os.environ, "NODE_PATH": str(TOOLS / "node_modules"), "BUILD_PATH": str(build_dir),
           "SEO_API_ORIGIN": api_origin}
    if (TOOLS / "browsers").is_dir():
        env["PLAYWRIGHT_BROWSERS_PATH"] = str(TOOLS / "browsers")
    proc = await asyncio.create_subprocess_exec("node", str(SCRIPT), env=env, cwd=str(SCRIPT.parent.parent),
                                                stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT)
    out, _ = await proc.communicate()
    tail = out.decode(errors="replace")[-1500:]
    if proc.returncode == 0:
        logger.info("Styled HTML refreshed after publish")
    else:
        logger.error(f"Styled HTML refresh failed (exit {proc.returncode}); previous pages kept:\n{tail}")


async def _debounced(build_dir: Path, api_origin: str):
    await asyncio.sleep(DELAY)
    _state["task"] = None
    if _state["running"]:
        _state["again"] = True
        return
    _state["running"] = True
    try:
        while True:
            _state["again"] = False
            await _run(build_dir, api_origin)
            if not _state["again"]:
                break
    except Exception as e:
        logger.error(f"Styled HTML refresh error: {e}")
    finally:
        _state["running"] = False


def schedule(build_dir: Path, api_origin: str) -> bool:
    if not enabled() or not (build_dir / ".react-shell.html").is_file():
        return False
    task = _state["task"]
    if task and not task.done():
        task.cancel()
    _state["task"] = asyncio.get_running_loop().create_task(_debounced(build_dir, api_origin))
    return True
