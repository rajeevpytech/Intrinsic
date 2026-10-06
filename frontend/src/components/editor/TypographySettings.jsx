import { useEffect, useRef, useState } from 'react';
import { ExternalLink, RotateCcw, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useLiveEdit } from './LiveEditProvider';
import { FONTS } from '../../lib/liveedit';
import { resolveTypography, TYPE_LABELS, TYPOGRAPHY_DEFAULTS } from '../../lib/typography';
import { TypographyPresets } from './TypographyPresets';
import { errMsg } from '../../lib/api';

const control = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700';
const TypeField = ({ label, name, value, onChange, options, ...props }) => (
  <label className="block min-w-0 space-y-1.5" htmlFor={`typography-${name}`}>
    <span className="text-xs font-medium text-slate-600">{label}</span>
    {options ? <select id={`typography-${name}`} data-testid={`typography-${name}`} className={control} value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option value={o.value} key={o.value}>{o.label}</option>)}
    </select> : <Input id={`typography-${name}`} data-testid={`typography-${name}`} className="bg-white text-slate-900" value={value} onChange={e => onChange(e.target.value)} {...props} />}
  </label>
);

const Specimen = ({ settings, category, dark }) => {
  const s = settings[category];
  return <div data-testid={`typography-preview-${dark ? 'dark' : 'light'}`} className={`rounded-lg border p-5 overflow-hidden ${dark ? 'bg-[#002f77] border-[#002f77]' : 'bg-white border-slate-200'}`}>
    <p className={`text-[10px] uppercase tracking-widest mb-4 ${dark ? 'text-white/70' : 'text-slate-500'}`}>{dark ? 'Dark background' : 'Light background'}</p>
    <p data-testid={`typography-specimen-${dark ? 'dark' : 'light'}`} style={{ fontFamily: s.family, fontSize: `${s.desktop}px`, fontWeight: s.weight, fontStyle: s.style, lineHeight: s.lineHeight, letterSpacing: `${s.letterSpacing}em`, color: dark ? s.darkColor : s.color, overflowWrap: 'anywhere' }}>
      {category === 'body' || category === 'small' ? 'Bringing structure, accountability, and oversight to your technology environment.' : 'Governance & Compliance'}
    </p>
  </div>;
};

export default function TypographySettings({ onClose }) {
  const ctx = useLiveEdit();
  const [draft, setDraft] = useState(() => resolveTypography(ctx.theme));
  const [category, setCategory] = useState('hero');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState(false);
  const frameRef = useRef(null);
  const sendPreview = () => frameRef.current?.contentWindow?.postMessage({ type:'intrinsic-typography-preview', theme:{ ...ctx.theme, headingFont:'', bodyFont:'', typographyPublished:true, typography:draft } }, window.location.origin);
  useEffect(() => { if (preview) sendPreview(); }, [draft, preview]);
  useEffect(() => { if (ctx.themeReady) setDraft(resolveTypography(ctx.theme)); }, [ctx.theme, ctx.themeReady]);
  useEffect(() => () => ctx.previewTheme(null), [ctx.previewTheme]);
  const settings = draft[category];
  const patch = (key, value) => {
    setMessage(null);
    const next = { ...draft, [category]: { ...settings, [key]: value } };
    setDraft(next);
    if (preview) ctx.previewTheme({ ...ctx.theme, headingFont: '', bodyFont: '', typographyPublished: true, typography: next });
  };
  const valid = Object.values(draft).every(s => ['mobile','tablet','desktop'].every(k => s[k] !== '' && Number(s[k]) >= 10 && Number(s[k]) <= 96) && s.lineHeight !== '' && Number(s.lineHeight) >= 1 && Number(s.lineHeight) <= 2.5 && s.letterSpacing !== '' && Number(s.letterSpacing) >= -0.05 && Number(s.letterSpacing) <= 0.3 && /^#[\da-f]{6}$/i.test(s.color) && /^#[\da-f]{6}$/i.test(s.darkColor));
  const save = async () => {
    setBusy(true); setMessage(null);
    try {
      await ctx.saveTheme({ typography: draft, headingFont: '', bodyFont: '' });
      setPreview(false); setMessage({ ok: true, text: 'Typography saved. These settings now apply to every public page.' });
    } catch (error) { setMessage({ ok: false, text: errMsg(error) }); }
    finally { setBusy(false); }
  };
  const cancel = () => { ctx.previewTheme(null); setPreview(false); setDraft(resolveTypography(ctx.theme)); setMessage(null); };
  const reset = () => { setDraft(resolveTypography()); ctx.previewTheme(null); setPreview(false); setMessage({ ok: true, text: 'Governance reference restored in this draft. Click Save to publish it.' }); };
  const loadPreset = preset => {
    ctx.previewTheme(null); setPreview(false);
    setDraft(resolveTypography({ typography:preset.typography }));
    setMessage({ ok:true, text:`“${preset.name}” loaded into your draft. Preview it, then Save typography to publish.` });
  };
  if (ctx.themeError) return <div role="alert" data-testid="typography-load-error" className="p-5 text-red-700">Could not load saved typography. Nothing has been changed. <Button onClick={ctx.reloadTheme} data-testid="typography-load-retry" variant="outline" className="ml-2">Retry</Button></div>;
  if (!ctx.themeReady) return <p data-testid="typography-loading" className="p-5 text-slate-600">Loading typography settings…</p>;
  return <div data-le-ui data-testid="typography-settings" className="text-slate-900 space-y-6">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-xs font-semibold tracking-widest uppercase text-blue-800">Website typography</p><h2 className="font-serif text-2xl mt-1">One standard. Every page.</h2><p className="text-sm text-slate-600 mt-2 max-w-xl">Based on Governance &amp; Compliance. Choose a text category, then adjust its font, responsive sizes and colors. Specific click-to-edit overrides take priority.</p></div>
      {onClose && <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close typography" data-testid="typography-close"><X size={18}/></Button>}
    </div>
    <TypographyPresets draft={draft} category={category} valid={valid} disabled={busy} onLoad={loadPreset}/>
    <div className="flex flex-wrap gap-2" data-testid="typography-categories">{Object.entries(TYPE_LABELS).map(([key, label]) => <Button key={key} variant={category === key ? 'default' : 'outline'} size="sm" onClick={() => setCategory(key)} aria-pressed={category === key} data-testid={`typography-category-${key}`}>{label}</Button>)}</div>
    <div className="grid sm:grid-cols-2 gap-4">
      <TypeField label="Font family" name="family" value={settings.family} onChange={v => patch('family', v)} options={FONTS.filter(f => f.value)} />
      <TypeField label="Font weight" name="weight" value={settings.weight} onChange={v => patch('weight', Number(v))} options={[400,450,500,600,700,800,900].map(w => ({ value:w,label:`${w}${w === 400 ? ' — Regular / thinner' : w === 450 ? ' — Book (site default)' : w === 600 ? ' — Semibold' : ''}` }))} />
      {['mobile','tablet','desktop'].map(size => <TypeField key={size} label={`${size[0].toUpperCase()+size.slice(1)} size (px)`} name={size} type="number" min="10" max="96" step="0.5" value={settings[size]} onChange={v => patch(size, v === '' ? '' : Number(v))} />)}
      <TypeField label="Style" name="style" value={settings.style} onChange={v => patch('style', v)} options={[{value:'normal',label:'Normal'},{value:'italic',label:'Italic'}]} />
      <TypeField label="Text on light backgrounds" name="color" type="color" value={settings.color} onChange={v => patch('color', v)} />
      <TypeField label="Text on dark backgrounds" name="dark-color" type="color" value={settings.darkColor} onChange={v => patch('darkColor', v)} />
      <TypeField label="Line height" name="line-height" type="number" min="1" max="2.5" step="0.01" value={settings.lineHeight} onChange={v => patch('lineHeight', v === '' ? '' : Number(v))} />
      <TypeField label="Letter spacing (em)" name="letter-spacing" type="number" min="-0.05" max="0.3" step="0.005" value={settings.letterSpacing} onChange={v => patch('letterSpacing', v === '' ? '' : Number(v))} />
    </div>
    <div className="grid md:grid-cols-2 gap-4"><Specimen settings={draft} category={category}/><Specimen settings={draft} category={category} dark/></div>
    <p data-testid="typography-reference" className="text-xs text-slate-600">Reference {TYPE_LABELS[category]}: {TYPOGRAPHY_DEFAULTS[category].mobile} / {TYPOGRAPHY_DEFAULTS[category].tablet} / {TYPOGRAPHY_DEFAULTS[category].desktop}px. Tablet begins at 640px; desktop at 1024px. Background designs and images stay unchanged.</p>
    <div aria-live="polite" data-testid="typography-message">
      {!valid ? <p role="alert" className="text-sm text-red-700">Use sizes from 10–96px, line height from 1–2.5, and letter spacing from −0.05–0.3em.</p> : message && <p role={message.ok ? 'status' : 'alert'} className={`text-sm ${message.ok ? 'text-green-800' : 'text-red-700'}`}>{message.text}</p>}
    </div>
    <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
      <Button data-testid="typography-save" onClick={save} disabled={busy || !valid}><Save size={15} className="mr-2"/>{busy ? 'Saving…' : 'Save typography'}</Button>
      <Button variant="outline" data-testid="typography-preview" disabled={!valid || busy} onClick={() => { ctx.previewTheme({ ...ctx.theme, headingFont:'', bodyFont:'', typographyPublished:true, typography:draft }); setPreview(true); setMessage({ ok:true,text:'Preview only in this tab. Visitors see the saved typography until you Save.' }); }}>Preview on page</Button>
      <Button variant="outline" data-testid="typography-cancel" onClick={cancel} disabled={busy}>Discard draft</Button>
      <Button variant="ghost" data-testid="typography-reset" onClick={reset} disabled={busy}><RotateCcw size={14} className="mr-2"/>Reset reference</Button>
    </div>
    {preview && ctx.path.startsWith('/admin') && <div className="border border-slate-200 rounded-lg overflow-hidden" data-testid="typography-page-preview">
      <p className="bg-slate-100 text-slate-700 px-4 py-2 text-xs">Unsaved website preview — Governance &amp; Compliance</p>
      <iframe ref={frameRef} onLoad={sendPreview} title="Typography page preview" data-testid="typography-preview-frame" src="/services/security-governance-compliance?lepreview=1" className="w-full h-[560px] border-0 bg-white" />
    </div>}
    <a href="/services/security-governance-compliance?edit=1" data-testid="typography-open-editor" className="inline-flex items-center gap-2 text-sm font-medium text-blue-800 underline underline-offset-4"><ExternalLink size={14}/>Open website: click text to edit</a>
  </div>;
}
