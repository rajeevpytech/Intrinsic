import { useEffect, useState } from 'react';
import { ChevronDown, Copy, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { api, errMsg } from '../../lib/api';
import { resolveTypography, TYPE_LABELS } from '../../lib/typography';

const selectClass = 'w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-700';
const sampleText = 'Structure, accountability, and oversight for your technology.';

const ComparisonCard = ({ side, preset, category, size, onLoad, disabled }) => {
  if (!preset) return null;
  const s = preset.typography[category];
  const style = { fontFamily:s.family, fontSize:`${s[size]}px`, fontWeight:s.weight, fontStyle:s.style, lineHeight:s.lineHeight, letterSpacing:`${s.letterSpacing}em`, overflowWrap:'anywhere' };
  return <article className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white" data-testid={`preset-comparison-${side}`}>
    <div className="p-4 border-b border-slate-200"><h3 className="text-sm font-semibold break-words" data-testid={`preset-comparison-${side}-name`}>{preset.name}</h3><p className="text-xs text-slate-600 mt-1" data-testid={`preset-comparison-${side}-metrics`}>{s.family.split(',')[0].replaceAll("'", '')} · {s[size]}px · {s.weight} · {s.style}</p></div>
    {[false, true].map(dark => <div key={String(dark)} className={`p-4 ${dark ? 'bg-[#002f77]' : 'bg-white'}`}>
      <p className={`mb-3 text-xs ${dark ? 'text-white/80' : 'text-slate-600'}`}>{dark ? 'Dark background' : 'Light background'}</p>
      <p style={{ ...style, color:dark ? s.darkColor : s.color }} data-testid={`preset-comparison-${side}-${dark ? 'dark' : 'light'}`}>{sampleText}</p>
    </div>)}
    <div className="p-3 border-t border-slate-200"><Button size="sm" variant="outline" onClick={() => onLoad(preset)} disabled={disabled || preset.id === 'draft'} data-testid={`preset-use-${side}`}>Load this style into draft</Button></div>
  </article>;
};

export const TypographyPresets = ({ draft, category, valid, disabled, onLoad }) => {
  const [presets, setPresets] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState(null);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState('');
  const [action, setAction] = useState(null);
  const [rename, setRename] = useState('');
  const [compare, setCompare] = useState(false);
  const [left, setLeft] = useState('draft');
  const [right, setRight] = useState('reference');
  const [size, setSize] = useState('desktop');
  const locked = busy || disabled;
  const loadStyle = preset => {
    setAction(null);
    setMessage({ ok:true, text:`“${preset.name}” is now in your draft. Preview and Save typography to publish.` });
    onLoad(preset);
  };
  const current = presets.find(p => p.id === selected);
  const options = [{ id:'draft', name:'Current draft', typography:draft }, { id:'reference', name:'Governance reference', typography:resolveTypography() }, ...presets];

  const fetchPresets = async () => {
    setLoading(true); setLoadError('');
    try { const { data } = await api.get('/typography-presets'); setPresets(data); }
    catch (error) { setLoadError(errMsg(error)); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchPresets(); }, []);

  const savePreset = async event => {
    event.preventDefault(); setBusy(true); setMessage(null);
    try {
      const { data } = await api.post('/typography-presets', { name:name.trim(), typography:draft });
      setPresets(prev => [data, ...prev]); setSelected(data.id); setRight(data.id); setName('');
      setMessage({ ok:true, text:'Preset saved. The live website has not changed.' });
    } catch (error) { setMessage({ ok:false, text:errMsg(error) }); }
    finally { setBusy(false); }
  };
  const confirmAction = async event => {
    event.preventDefault(); setBusy(true); setMessage(null);
    try {
      if (action.kind === 'rename') {
        const { data } = await api.patch(`/typography-presets/${action.preset.id}`, { name:rename.trim() });
        setPresets(prev => prev.map(p => p.id === data.id ? data : p));
        setMessage({ ok:true, text:'Preset renamed. Its saved typography is unchanged.' });
      } else {
        await api.delete(`/typography-presets/${action.preset.id}`);
        setPresets(prev => prev.filter(p => p.id !== action.preset.id));
        if (selected === action.preset.id) setSelected('');
        if (left === action.preset.id) setLeft('draft');
        if (right === action.preset.id) setRight('reference');
        setMessage({ ok:true, text:'Preset deleted. Your draft and published typography are unchanged.' });
      }
      setAction(null);
    } catch (error) { setMessage({ ok:false, text:errMsg(error) }); }
    finally { setBusy(false); }
  };

  return <section data-le-ui data-testid="typography-presets" className="min-w-0 rounded-lg border border-slate-200 bg-slate-50">
    <button type="button" onClick={() => setExpanded(v => !v)} aria-expanded={expanded} aria-controls="typography-presets-content" data-testid="typography-presets-toggle" className="w-full flex items-center justify-between gap-3 p-4 text-left text-sm font-semibold hover:bg-slate-100 transition-colors">
      <span className="flex items-center gap-2"><Copy size={16}/>Saved typography styles <span className="text-slate-500 font-normal" data-testid="typography-presets-count">({presets.length})</span></span><ChevronDown size={16} className={`shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}/>
    </button>
    {expanded && <div id="typography-presets-content" className="p-4 pt-0 space-y-5">
      <p className="text-xs text-slate-600">Presets save all seven text categories. Load one into your draft, preview it, then use Save typography to publish. Specific click-to-edit overrides still take priority.</p>
      {loading ? <p data-testid="presets-loading" className="text-sm text-slate-600">Loading saved styles…</p> : loadError ? <div role="alert" data-testid="presets-load-error" className="text-sm text-red-700">{loadError}<Button variant="outline" size="sm" onClick={fetchPresets} data-testid="presets-retry" className="ml-3">Retry</Button></div> : <>
        <form onSubmit={savePreset} className="space-y-2">
          <label htmlFor="preset-name" className="text-xs font-medium text-slate-700">Save the current draft as a new preset</label>
          <div className="flex flex-col sm:flex-row gap-2"><Input id="preset-name" data-testid="preset-name" maxLength={60} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Editorial headings" className="min-w-0 bg-white" disabled={locked}/><Button type="submit" disabled={locked || !valid || !name.trim()} data-testid="preset-save"><Plus size={14} className="mr-2"/>{busy && !action ? 'Saving…' : 'Save preset'}</Button></div>
          {!valid && <p role="alert" data-testid="preset-invalid-draft" className="text-xs text-red-700">Correct the typography values before saving a preset.</p>}
        </form>
        {presets.length ? <div className="space-y-2">
          <label htmlFor="preset-select" className="text-xs font-medium text-slate-700">Your saved styles</label>
          <select id="preset-select" data-testid="preset-select" value={selected} onChange={e => { setSelected(e.target.value); setAction(null); }} className={selectClass} disabled={locked}><option value="">Choose a preset</option>{presets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => loadStyle(current)} disabled={locked || !current} data-testid="preset-load">Load into draft</Button>
            <Button size="sm" variant="outline" onClick={() => { setAction({ kind:'rename', preset:current }); setRename(current.name); }} disabled={locked || !current} data-testid="preset-rename"><Pencil size={13} className="mr-1"/>Rename</Button>
            <Button size="sm" variant="outline" onClick={() => setAction({ kind:'delete', preset:current })} disabled={locked || !current} data-testid="preset-delete"><Trash2 size={13} className="mr-1"/>Delete</Button>
          </div>
        </div> : <p data-testid="presets-empty" className="text-sm text-slate-600">No saved presets yet. Name your current draft to keep it for later.</p>}
      </>}
      {action && <form onSubmit={confirmAction} data-testid="preset-action" className="rounded-md border border-slate-300 bg-white p-4 space-y-3">
        {action.kind === 'rename' ? <label htmlFor="preset-rename-name" className="block text-sm">New preset name<Input autoFocus id="preset-rename-name" data-testid="preset-rename-name" className="mt-2" maxLength={60} value={rename} onChange={e => setRename(e.target.value)} disabled={locked}/></label> : <p className="text-sm break-words" data-testid="preset-delete-confirmation">Delete “{action.preset.name}”? This removes the saved preset only, not the live website style.</p>}
        <div className="flex flex-wrap gap-2"><Button type="submit" size="sm" disabled={locked || (action.kind === 'rename' && !rename.trim())} data-testid="preset-confirm">{busy ? 'Working…' : action.kind === 'rename' ? 'Save name' : 'Delete preset'}</Button><Button type="button" variant="outline" size="sm" onClick={() => setAction(null)} disabled={locked} data-testid="preset-action-cancel">Cancel</Button></div>
      </form>}
      <div aria-live="polite" data-testid="preset-message">{message && <p role={message.ok ? 'status' : 'alert'} className={`text-sm ${message.ok ? 'text-green-800' : 'text-red-700'}`}>{message.text}</p>}</div>
      <Button variant="outline" size="sm" onClick={() => setCompare(v => !v)} aria-expanded={compare} data-testid="preset-compare-toggle">{compare ? 'Close comparison' : 'Compare styles side by side'}</Button>
      {compare && <div className="space-y-4 border-t border-slate-200 pt-4" data-testid="preset-compare-view">
        <p className="text-sm font-medium" data-testid="preset-compare-category">Comparing {TYPE_LABELS[category]}. Change the text category below to compare another part of each preset.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[['left',left,setLeft],['right',right,setRight]].map(([side,value,setter]) => <label key={side} htmlFor={`preset-compare-${side}`} className="min-w-0 text-xs font-medium">{side === 'left' ? 'First style' : 'Second style'}<select id={`preset-compare-${side}`} data-testid={`preset-compare-${side}`} className={`${selectClass} mt-1`} value={value} onChange={e => setter(e.target.value)}>{options.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>)}
          <label htmlFor="preset-compare-size" className="text-xs font-medium">Screen size<select id="preset-compare-size" data-testid="preset-compare-size" className={`${selectClass} mt-1`} value={size} onChange={e => setSize(e.target.value)}>{['mobile','tablet','desktop'].map(s => <option key={s} value={s}>{s[0].toUpperCase()+s.slice(1)}</option>)}</select></label>
        </div>
        <div className="grid md:grid-cols-2 gap-4"><ComparisonCard side="left" preset={options.find(p => p.id === left)} category={category} size={size} onLoad={loadStyle} disabled={locked}/><ComparisonCard side="right" preset={options.find(p => p.id === right)} category={category} size={size} onLoad={loadStyle} disabled={locked}/></div>
      </div>}
    </div>}
  </section>;
};
