import { useEffect, useRef, useState } from "react";
import { X, RefreshCw } from "lucide-react";

const SIZES = { phone: { w: 390, h: 780, label: "Phone · 390px" }, tablet: { w: 820, h: 900, label: "Tablet · 820px" } };

export default function DevicePreview({ device, path, edits, onClose }) {
  const frame = useRef(null);
  const sendDraft = () => frame.current?.contentWindow?.postMessage({ type: 'intrinsic-live-edits-preview', path, edits }, window.location.origin);
  useEffect(() => {
    frame.current?.contentWindow?.postMessage({ type: 'intrinsic-live-edits-preview', path, edits }, window.location.origin);
  }, [path, edits]);
  const d = SIZES[device] || SIZES.phone;
  const [nonce, setNonce] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const avail = window.innerHeight - 190;
      setScale(Math.min(1, avail / d.h));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [d.h]);

  const src = `${path}${path.includes("?") ? "&" : "?"}lepreview=1&n=${nonce}`;

  return (
    <div data-le-ui data-testid="device-preview"
      className="fixed right-4 lg:right-[350px] top-16 z-[10055] rounded-xl bg-[#12121f] border border-white/12 shadow-2xl p-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] uppercase tracking-[0.12em] text-white/60 font-semibold">{d.label}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setNonce((n) => n + 1)} title="Reload preview" className="p-1.5 rounded hover:bg-white/15 text-white/70" data-testid="device-preview-reload"><RefreshCw size={13} /></button>
          <button onClick={onClose} title="Close preview" className="p-1.5 rounded hover:bg-white/15 text-white/70" data-testid="device-preview-close"><X size={15} /></button>
        </div>
      </div>
      <div style={{ width: d.w * scale, height: d.h * scale }} className="overflow-hidden rounded-lg bg-white">
        <iframe ref={frame} onLoad={sendDraft} title="device preview" src={src} data-testid="device-preview-frame"
          style={{ width: d.w, height: d.h, border: 0, transform: `scale(${scale})`, transformOrigin: "top left" }} />
      </div>
      <p className="text-[10px] text-white/40 mt-2 px-1 max-w-[300px]" data-testid="device-preview-note">Unsaved changes appear here immediately. Choose Phone or Tablet in “Applies to” for screen-specific styles. Save to publish.</p>
    </div>
  );
}
