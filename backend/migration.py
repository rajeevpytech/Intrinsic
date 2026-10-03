"""Full-site Export / Import for moving the whole app between servers.

Exports every MongoDB collection (content, design, settings, inquiries, admin
account, analytics, etc.) plus the binaries of every admin-uploaded file in
object storage, as a single portable JSON bundle. Import replaces the matching
collections on the target server and re-uploads the file binaries.
"""
import base64
import asyncio
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from bson import json_util

logger = logging.getLogger(__name__)

EXPORT_SIGNATURE = "intrinsic-site-export"
EXPORT_VERSION = 1


def create_migration_router(db, admin_dependency, put_object, get_object):
    router = APIRouter(prefix="/api/admin", tags=["migration"])

    @router.get("/export")
    async def export_site(admin: dict = Depends(admin_dependency)):
        collection_names = [n for n in await db.list_collection_names() if not n.startswith("system.")]
        collections = {}
        for name in sorted(collection_names):
            collections[name] = await db[name].find({}).to_list(None)

        files = {}
        seen = set()
        async for record in db.files.find({"is_deleted": {"$ne": True}}):
            path = record.get("storage_path")
            if not path or path in seen:
                continue
            seen.add(path)
            try:
                data, ctype = await asyncio.to_thread(get_object, path)
            except Exception as exc:
                logger.error(f"Export: could not fetch file {path}: {exc}")
                continue
            files[path] = {"content_type": ctype, "data": base64.b64encode(data).decode()}

        bundle = {
            "signature": EXPORT_SIGNATURE,
            "version": EXPORT_VERSION,
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "collections": collections,
            "files": files,
        }
        payload = json_util.dumps(bundle)
        stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
        filename = f"intrinsic-site-export-{stamp}.json"
        return Response(
            content=payload,
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    @router.post("/import")
    async def import_site(file: UploadFile = File(...), admin: dict = Depends(admin_dependency)):
        raw = await file.read()
        try:
            bundle = json_util.loads(raw.decode("utf-8"))
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid file: this is not valid JSON.")
        if not isinstance(bundle, dict) or bundle.get("signature") != EXPORT_SIGNATURE:
            raise HTTPException(status_code=400, detail="This file is not a valid Intrinsic site export.")

        collections = bundle.get("collections") or {}
        files = bundle.get("files") or {}
        if not collections:
            raise HTTPException(status_code=400, detail="The export contains no data to import.")

        summary = {}
        for name, docs in collections.items():
            if name.startswith("system."):
                continue
            await db[name].delete_many({})
            if docs:
                await db[name].insert_many(docs)
            summary[name] = len(docs or [])

        restored_files = 0
        failed_files = 0
        for path, info in files.items():
            try:
                data = base64.b64decode(info["data"])
                await asyncio.to_thread(put_object, path, data, info.get("content_type") or "application/octet-stream")
                restored_files += 1
            except Exception as exc:
                failed_files += 1
                logger.error(f"Import: could not restore file {path}: {exc}")

        return {
            "success": True,
            "exported_at": bundle.get("exported_at"),
            "collections": summary,
            "records_restored": sum(summary.values()),
            "files_restored": restored_files,
            "files_failed": failed_files,
        }

    return router
