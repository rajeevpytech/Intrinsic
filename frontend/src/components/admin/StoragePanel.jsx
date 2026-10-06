import React, { useEffect, useState } from "react";
import { HardDrive, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { api, errMsg } from "../../lib/api";

const StoragePanel = () => {
  const [status, setStatus] = useState(null);
  const [copying, setCopying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/admin/storage/status").then(({ data }) => setStatus(data)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);

  const copy = async () => {
    setCopying(true); setError(""); setResult(null);
    try { const { data } = await api.post("/admin/storage/copy-to-local"); setResult(data); load(); }
    catch (e) { setError(errMsg(e)); }
    finally { setCopying(false); }
  };

  const local = status?.backend === "local";
  return (
    <div className="bg-white border border-powder p-5 mt-5" data-testid="storage-card">
      <h3 className="font-serif text-[18px] text-midnight font-semibold flex items-center gap-2"><HardDrive size={18} /> Image &amp; file storage</h3>
      {status && (
        <p className="text-[13px] text-[#3a4356] mt-2" data-testid="storage-status">
          Uploads are currently stored {local ? <b>on this server's disk</b> : <b>in Emergent cloud storage</b>}.{" "}
          {status.on_this_server} of {status.total_files} uploaded files are already on this server.
        </p>
      )}
      <ol className="text-[13px] text-[#3a4356] mt-3 list-decimal pl-5 space-y-1" data-testid="storage-steps">
        <li>Click <b>Copy all files to this server</b> below (safe to repeat — files already copied are skipped).</li>
        <li>In <code>backend/.env</code> add <code>STORAGE_BACKEND=local</code> (optional: <code>LOCAL_STORAGE_DIR=/path/to/folder</code>), then restart the backend.</li>
        <li>New uploads are now saved on this server and every image is served from it — no outside storage needed.</li>
      </ol>
      {status && <p className="text-[12px] text-slatesage mt-2">Folder on this server: <code data-testid="storage-dir">{status.local_dir}</code></p>}
      <button onClick={copy} disabled={copying || local} className="btn-amber mt-4 disabled:opacity-50" data-testid="storage-copy-btn">
        {copying ? <><Loader2 size={15} className="animate-spin" /> Copying…</> : "Copy all files to this server"}
      </button>
      {local && <p className="text-[12px] text-emerald-700 mt-2" data-testid="storage-local-note">Already using this server's disk — nothing to copy.</p>}
      {result && (
        <p className="flex items-center gap-2 text-[13px] text-emerald-800 mt-3" data-testid="storage-copy-result">
          <CheckCircle2 size={15} /> Copied {result.copied}, already here {result.already_here}{result.failed ? `, failed ${result.failed}` : ""}.
        </p>
      )}
      {error && <p className="flex items-center gap-2 text-red-600 text-[13px] mt-3" role="alert" data-testid="storage-error"><AlertTriangle size={15} /> {error}</p>}
    </div>
  );
};

export default StoragePanel;
