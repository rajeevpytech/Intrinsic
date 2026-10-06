import { useEffect, useRef, useState } from 'react';
import { Code2, Eye, Save, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';
import { api, errMsg } from '../../lib/api';

const EXAMPLE = `/* One page only. Stable element names survive layout changes. */
html[data-le-page="/resources"][data-le-page] [data-testid="resources-hero"] {
  background-color: #00388e !important;
}

/* Use !important when overriding existing editor styles. */`;

export default function CustomCssPanel() {
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const [pagePath, setPagePath] = useState('/resources');
  const [previewPath, setPreviewPath] = useState('/resources?lepreview=1');
  const [previewCss, setPreviewCss] = useState(null);
  const [clearOpen, setClearOpen] = useState(false);
  const frame = useRef(null);
  const dirty = draft !== saved;

  const load = async () => {
    setReady(false);
    setStatus(null);
    try {
      const { data } = await api.get('/custom-css');
      setDraft(data.css);
      setSaved(data.css);
      setUpdatedAt(data.updated_at);
      setReady(true);
    } catch (error) { setStatus({ error: true, text: errMsg(error) }); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const sendPreview = () => {
    if (previewCss !== null) frame.current?.contentWindow?.postMessage({ type: 'intrinsic-custom-css-preview', css: previewCss }, window.location.origin);
  };
  useEffect(() => {
    if (previewCss !== null) frame.current?.contentWindow?.postMessage({ type: 'intrinsic-custom-css-preview', css: previewCss }, window.location.origin);
  }, [previewCss]);

  const preview = async () => {
    setBusy(true);
    setStatus(null);
    try {
      const url = new URL(pagePath, window.location.origin);
      if (!pagePath.startsWith('/') || url.origin !== window.location.origin || /^\/admin(?:\/|$)/.test(url.pathname)) throw new Error('Choose a public page path on this website, such as /resources.');
      await api.post('/custom-css/validate', { css: draft });
      url.searchParams.set('lepreview', '1');
      setPreviewCss(draft);
      setPreviewPath(url.pathname + url.search + url.hash);
      setStatus({ text: 'Preview only. Visitors still see your published CSS.' });
    } catch (error) { setStatus({ error: true, text: errMsg(error) }); }
    finally { setBusy(false); }
  };

  const publish = async (css) => {
    setBusy(true);
    setStatus(null);
    try {
      const { data } = await api.put('/custom-css', { css });
      setSaved(data.css);
      setDraft(data.css);
      setPreviewCss(data.css);
      setUpdatedAt(data.updated_at);
      setClearOpen(false);
      setStatus({ text: css ? 'Published to the site database. Public pages will use this CSS on their next load.' : 'Custom CSS cleared. Your visual-editor edits and theme settings are unchanged.' });
    } catch (error) { setStatus({ error: true, text: errMsg(error) }); }
    finally { setBusy(false); }
  };

  return <div className="space-y-5 min-w-0" data-testid="admin-custom-css">
    <div className="rounded-lg border border-powder bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3"><Code2 className="text-navy shrink-0 mt-0.5" size={22} /><div>
        <h2 className="font-semibold text-navy text-lg">Styles you control</h2>
        <p className="text-sm text-slate-600 mt-1" data-testid="custom-css-storage-note">Saved in this site's database, independently of code updates. CSS applies to public pages only—not admin or login.</p>
      </div></div>
    </div>
    {status && <div role={status.error ? 'alert' : 'status'} data-testid="admin-css-status" className={`rounded-lg border p-4 text-sm ${status.error ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
      {status.text}{!ready && <Button variant="outline" className="ml-3" onClick={load} data-testid="admin-css-load-retry">Retry loading</Button>}
    </div>}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 min-w-0">
      <section className="min-w-0 rounded-lg border border-powder bg-white overflow-hidden">
        <div className="p-4 border-b border-powder flex items-center justify-between gap-3">
          <label htmlFor="admin-custom-css-input" className="font-semibold text-sm text-navy">Custom CSS</label>
          <span className="text-xs text-slate-500" data-testid="admin-css-draft-state">{!ready ? 'Loading saved CSS…' : dirty ? 'Unpublished changes' : 'Saved version'}</span>
        </div>
        <Textarea id="admin-custom-css-input" data-testid="admin-custom-css-input" value={draft} onChange={event => setDraft(event.target.value)} disabled={!ready || busy} maxLength={50000} placeholder={EXAMPLE} spellCheck={false} wrap="off" aria-describedby="admin-css-help"
          className="w-full min-w-0 min-h-[380px] max-h-[700px] rounded-none border-0 bg-[#0b162a] text-[#edf2fa] placeholder:text-[#8291aa] font-mono text-[13px] leading-6 p-5 focus-visible:ring-inset resize-y" />
        <div className="p-4 space-y-4">
          <div className="flex justify-between text-xs text-slate-500" data-testid="admin-css-size"><span>{draft.split('\n').length} lines</span><span>{draft.length.toLocaleString()} / 50,000 characters</span></div>
          <p id="admin-css-help" className="text-xs leading-relaxed text-slate-600">Paste CSS rules only, without &lt;style&gt; tags. Use stable <code>data-testid</code> selectors and <code>!important</code> to override editor styles. Preview does not change the live site.</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={preview} disabled={!ready || busy} variant="outline" data-testid="admin-css-preview-btn"><Eye size={15} className="mr-2" />Preview</Button>
            <Button onClick={() => publish(draft)} disabled={!ready || busy || !dirty} data-testid="admin-css-publish-btn"><Save size={15} className="mr-2" />{busy ? 'Working…' : 'Publish CSS'}</Button>
            <Button variant="outline" onClick={() => { setDraft(saved); setPreviewCss(saved); setStatus(null); }} disabled={!ready || busy || !dirty} data-testid="admin-css-discard-btn"><RotateCcw size={15} className="mr-2" />Discard draft</Button>
            <Button variant="ghost" className="text-red-700" onClick={() => setClearOpen(true)} disabled={!ready || busy || (!saved && !draft)} data-testid="admin-css-clear-btn"><Trash2 size={15} className="mr-2" />Clear CSS</Button>
          </div>
          <p className="text-xs text-slate-500" data-testid="admin-css-last-published">{updatedAt ? `Last published: ${new Date(updatedAt).toLocaleString()}` : 'No custom CSS published yet.'}</p>
        </div>
      </section>
      <section className="min-w-0 rounded-lg border border-powder bg-white overflow-hidden">
        <div className="p-4 border-b border-powder space-y-2">
          <label htmlFor="admin-css-page-path" className="font-semibold text-sm text-navy">Public-page preview</label>
          <Input id="admin-css-page-path" data-testid="admin-css-page-path" value={pagePath} onChange={event => setPagePath(event.target.value)} placeholder="/resources" />
          <p className="text-xs text-slate-500">Enter a page path, then select Preview. This frame follows the available screen width.</p>
        </div>
        <iframe ref={frame} title="Custom CSS public-page preview" src={previewPath} onLoad={sendPreview} className="w-full h-[620px] border-0 bg-white" data-testid="admin-css-preview-iframe" />
      </section>
    </div>
    <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
      <AlertDialogContent data-testid="admin-css-clear-dialog">
        <AlertDialogHeader><AlertDialogTitle>Clear published custom CSS?</AlertDialogTitle><AlertDialogDescription>This removes only custom CSS. It does not reset any visual-editor changes or theme settings. Copy your CSS first if you want to keep a backup.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel disabled={busy} data-testid="admin-css-clear-cancel">Cancel</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={event => { event.preventDefault(); publish(''); }} data-testid="admin-css-clear-confirm">Clear CSS</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
}
