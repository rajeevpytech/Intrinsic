import React, { useState, useRef } from "react";
import { Download, Upload, DatabaseBackup, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { api, errMsg } from "../../lib/api";
import StoragePanel from "./StoragePanel";

const MigrationPanel = () => {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [importError, setImportError] = useState("");
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);
  const chosenFile = useRef(null);

  const doExport = async () => {
    setExporting(true); setExportError("");
    try {
      const res = await api.get("/admin/export", { responseType: "blob" });
      const disp = res.headers["content-disposition"] || "";
      const match = disp.match(/filename="?([^"]+)"?/);
      const name = match ? match[1] : `intrinsic-site-export-${Date.now()}.json`;
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(errMsg(err));
    } finally {
      setExporting(false);
    }
  };

  const onPick = (e) => {
    const f = e.target.files?.[0] || null;
    chosenFile.current = f;
    setFileName(f ? f.name : "");
    setResult(null); setImportError("");
  };

  const doImport = async () => {
    const f = chosenFile.current;
    if (!f) { setImportError("Choose an export file first."); return; }
    const ok = window.confirm(
      "Import will REPLACE all current site data (content, design, settings, inquiries and the admin account) with the contents of this backup. This cannot be undone. Continue?"
    );
    if (!ok) return;
    setImporting(true); setImportError(""); setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const { data } = await api.post("/admin/import", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(data);
      chosenFile.current = null; setFileName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setImportError(errMsg(err));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div data-testid="editor-migration" className="max-w-[760px]">
      <h2 className="font-serif text-[26px] text-midnight font-semibold mb-2">Export &amp; Import</h2>
      <p className="text-slatesage text-[14px] mb-6">
        Move this entire website to another server. The backup bundles every page's content and design
        (theme, custom CSS, live edits, typography), all settings, inquiries &amp; applications, the admin
        login account, and every uploaded image/PDF — in one file. On the new server, open this same page and import it.
      </p>

      {/* Export */}
      <div className="bg-white border border-powder p-5 mb-5" data-testid="migration-export-card">
        <div className="flex items-center gap-2 mb-2">
          <DatabaseBackup size={18} className="text-navy" />
          <h3 className="text-[15px] font-semibold text-midnight">Download a full backup</h3>
        </div>
        <p className="text-slatesage text-[13px] mb-4">
          Generates a single <code>.json</code> file containing the whole site and all uploaded media.
          Keep it somewhere safe — it includes the admin account.
        </p>
        <button onClick={doExport} disabled={exporting} className="btn-amber" data-testid="migration-export-btn">
          <span className="btn-arrow">{exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}</span>
          <span>{exporting ? "Preparing backup…" : "Download site backup"}</span>
        </button>
        {exportError && <p className="text-red-600 text-[13px] mt-3" role="alert" data-testid="migration-export-error">{exportError}</p>}
      </div>

      {/* Import */}
      <div className="bg-white border border-powder p-5" data-testid="migration-import-card">
        <div className="flex items-center gap-2 mb-2">
          <Upload size={18} className="text-navy" />
          <h3 className="text-[15px] font-semibold text-midnight">Restore from a backup</h3>
        </div>
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-[13px] px-3 py-2 mb-4" data-testid="migration-import-warning">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>Importing <strong>replaces</strong> all existing data on this server with the backup. If the backup has different admin credentials, you'll need to log in again with those after import.</span>
        </div>
        <label className="btn-outline cursor-pointer inline-flex" data-testid="migration-file-label">
          <span className="btn-arrow"><Upload size={14} /></span>
          <span>{fileName ? "Choose a different file" : "Choose backup file"}</span>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={onPick} data-testid="migration-file-input" />
        </label>
        {fileName && <p className="text-[13px] text-midnight mt-2" data-testid="migration-file-name">Selected: <strong>{fileName}</strong></p>}

        <div className="mt-4">
          <button onClick={doImport} disabled={importing || !fileName} className="btn-amber disabled:opacity-50 disabled:cursor-not-allowed" data-testid="migration-import-btn">
            <span className="btn-arrow">{importing ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} className="rotate-180" />}</span>
            <span>{importing ? "Importing…" : "Import & replace all data"}</span>
          </button>
        </div>

        {importError && <p className="text-red-600 text-[13px] mt-3" role="alert" data-testid="migration-import-error">{importError}</p>}

        {result && (
          <div className="mt-4 border border-emerald-200 bg-emerald-50 p-4" data-testid="migration-import-result">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[14px] mb-2">
              <CheckCircle2 size={18} /> Import complete
            </div>
            <p className="text-[13px] text-emerald-800">
              Restored <strong>{result.records_restored}</strong> records across <strong>{Object.keys(result.collections || {}).length}</strong> collections
              {result.files_restored ? <> and <strong>{result.files_restored}</strong> media files</> : null}.
              {result.files_failed ? <span className="text-amber-700"> ({result.files_failed} media files could not be restored.)</span> : null}
            </p>
            {result.exported_at && <p className="text-[12px] text-emerald-700 mt-1">Backup created: {new Date(result.exported_at).toLocaleString()}</p>}
            <p className="text-[12px] text-slatesage mt-2">Refresh the site to see the imported content. If credentials changed, log in again.</p>
          </div>
        )}
      </div>
      <StoragePanel />
    </div>
  );
};

export default MigrationPanel;
