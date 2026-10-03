import { useState } from "react";
import { X, Check } from "lucide-react";
import TypographySettings from "./TypographySettings";
import { errMsg } from "../../lib/api";
import { SWATCHES } from "../../lib/liveedit";

const Field = ({ label, value, onChange, testid }) => (
  <div className="mb-4" data-testid={testid}>
    <div className="text-[10px] uppercase tracking-[0.12em] text-white/45 mb-1.5 font-medium">{label}</div>
    <div className="flex items-center gap-2">
      <input type="color" data-testid={`${testid}-picker`} aria-label={label} value={/^#[0-9a-f]{6}$/i.test(value || "") ? value : "#ffffff"} onChange={(e) => onChange(e.target.value)}
        className="w-9 h-8 rounded bg-transparent border border-white/20 cursor-pointer p-0.5" />
      <input type="text" data-testid={`${testid}-hex`} aria-label={`${label} hex`} value={value || ""} placeholder="default" onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 bg-white/10 border border-white/15 rounded px-2 py-1.5 text-[12px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40" />
      <button data-testid={`${testid}-reset`} onClick={() => onChange("")} className="text-white/50 hover:text-white p-1" title="Reset"><X size={13} /></button>
    </div>
    <div className="flex flex-wrap gap-1 mt-1.5">
      {SWATCHES.map((c) => (
        <button key={c} data-testid={`${testid}-swatch-${c.slice(1)}`} onClick={() => onChange(c)} style={{ background: c }} title={c}
          className="w-[18px] h-[18px] rounded-sm border border-white/25 hover:scale-110 transition-transform" />
      ))}
    </div>
  </div>
);

export default function ThemePanel({ theme, onSave, onClose }) {
  const [t, setT] = useState({ brand: "", royal: "", accent: "", headingFont: "", bodyFont: "", pageBg: "", ...theme });
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState('typography');
  const [error, setError] = useState('');
  const set = (k) => (v) => setT((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setError('');
    try {
      await onSave({ brand: t.brand, royal: t.royal, accent: t.accent, pageBg: t.pageBg });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (e) { setError(errMsg(e)); }
  };

  return (
    <div data-le-ui data-testid="theme-panel"
      className="fixed left-3 top-16 z-[10050] w-[620px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-210px)] overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl text-slate-900 p-5">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex gap-2">
          <button onClick={() => setMode('typography')} data-testid="theme-typography-tab" className="text-sm font-semibold px-3 py-2 border rounded">Typography</button>
          <button onClick={() => setMode('colors')} data-testid="theme-colors-tab" className="text-sm font-semibold px-3 py-2 border rounded">Brand colors</button>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100" data-testid="theme-close" aria-label="Close site theme"><X size={16} /></button>
      </div>
      {mode === 'typography' ? <TypographySettings/> : <div className="rounded-lg bg-[#12121f] text-white p-4">

      <Field label="Brand blue" value={t.brand} onChange={set("brand")} testid="theme-brand" />
      <Field label="Deep blue" value={t.royal} onChange={set("royal")} testid="theme-royal" />
      <Field label="Accent / buttons" value={t.accent} onChange={set("accent")} testid="theme-accent" />
      <Field label="Page background" value={t.pageBg} onChange={set("pageBg")} testid="theme-pagebg" />


      {error && <p role="alert" className="text-red-300 text-sm mb-3" data-testid="theme-error">{error}</p>}
      <button onClick={save} data-testid="theme-save"
        className="w-full flex items-center justify-center gap-2 bg-[#faaf6a] text-midnight text-[12px] font-semibold py-2 rounded hover:brightness-105">
        {saved ? <><Check size={13} /> Saved</> : "Apply theme to whole site"}
      </button>
      </div>}
    </div>
  );
}
