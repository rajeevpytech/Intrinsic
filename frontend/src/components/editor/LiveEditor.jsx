import { useCallback, useEffect, useRef, useState } from "react";
import { useModes } from "../../lib/modes";
import { useLocation } from "react-router-dom";
import { MousePointerClick, Palette, RotateCcw, Wand2, Square, Undo2, ListTree, Smartphone, Tablet, Monitor, HelpCircle, Save, X } from "lucide-react";
import { errMsg } from '../../lib/api';
import { useLiveEdit } from "./LiveEditProvider";
import EditorPanel from "./EditorPanel";
import ThemePanel from "./ThemePanel";
import EditsList from "./EditsList";
import DevicePreview from "./DevicePreview";
import EditorIntro, { introSeen, markIntroSeen } from "./EditorIntro";
import { cssPath, describeEl, isEditUi, scopeKey, editPath, iconRoot } from "../../lib/liveedit";

const skip = (el) => !el || isEditUi(el) || el.closest?.("[data-review-ui]") || el === document.documentElement || el === document.body;
const targetAt = (x, y) => document.elementsFromPoint(x, y).find((el) => !skip(el)) || null;
const rectOf = (el) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

export default function LiveEditor() {
  const { pathname, search } = useLocation();
  const ctx = useLiveEdit();
  const [editing, setEditing] = useState(true);
  const [hover, setHover] = useState(null);
  const [sel, setSel] = useState(null);
  const [selRect, setSelRect] = useState(null);
  const [themeOpen, setThemeOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [scope, setScope] = useState("all");
  const [device, setDevice] = useState(null);
  const [intro, setIntro] = useState(!introSeen());
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [closed, setClosed] = useState(false);
  const save = async () => {
    setSaving(true); setSaveMessage(null);
    try { await ctx.saveEdits(); setSaveMessage({ ok: true, text: 'Saved to the site database. Visitors now see these changes.' }); }
    catch (error) { setSaveMessage({ ok: false, text: errMsg(error) }); }
    finally { setSaving(false); }
  };
  const elRef = useRef(null);

  const isPreview = new URLSearchParams(search).get("lepreview") === "1";
  const modes = useModes();
  const active = modes.editor_enabled !== false && !!ctx?.isAdmin && !pathname.startsWith("/admin") && !isPreview;

  const select = useCallback((target) => {
    const el = iconRoot(target);
    if (!el) return;
    elRef.current = el;
    setSel({ el, selector: editPath(el), label: describeEl(el) });
    setSelRect(rectOf(el));
  }, []);

  useEffect(() => { setSel(null); setHover(null); elRef.current = null; }, [pathname]);

  useEffect(() => {
    if (!active || !editing || !ctx.editsReady) return;
    let raf = 0;
    const onMove = (e) => {
      const { clientX, clientY } = e;
      const eventTarget = e.target;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = eventTarget instanceof Element && !skip(eventTarget) ? eventTarget : targetAt(clientX, clientY);
        const h = t && iconRoot(t);
        setHover(h ? { rect: rectOf(h), label: describeEl(h) } : null);
      });
    };
    const onClick = (e) => {
      if (isEditUi(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      select(e.target instanceof Element && !skip(e.target) ? e.target : targetAt(e.clientX, e.clientY));
      setHover(null);
    };
    const onKey = (e) => { if (e.key === "Escape") { setSel(null); setHover(null); } };
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);
    document.documentElement.dataset.leEditing = "1";
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
      delete document.documentElement.dataset.leEditing;
      setHover(null);
    };
  }, [active, editing, select, ctx.editsReady]);

  useEffect(() => {
    if (!sel) return;
    const tick = () => setSelRect(rectOf(elRef.current));
    const iv = setInterval(tick, 350);
    window.addEventListener("scroll", tick, true);
    window.addEventListener("resize", tick);
    return () => { clearInterval(iv); window.removeEventListener("scroll", tick, true); window.removeEventListener("resize", tick); };
  }, [sel]);

  if (!active) return null;

  if (closed) {
    return (
      <button data-le-ui onClick={() => { setClosed(false); setEditing(true); }} data-testid="live-editor-open" title="Open live editor"
        className="fixed bottom-3 left-3 z-[10060] flex items-center gap-1.5 rounded-full bg-[#12121f] text-white text-[12px] font-semibold px-3 py-2 shadow-2xl border border-white/10 hover:bg-[#1c1c2e]"
        style={{ zoom: 'calc(1 / var(--z))' }}>
        <Wand2 size={13} className="text-[#faaf6a]" /> Open editor
      </button>
    );
  }

  const closeEditor = () => {
    if (ctx.hasUnsavedEdits && !window.confirm("You have unsaved changes. Close the editor anyway?")) return;
    setSel(null); setHover(null); setThemeOpen(false); setListOpen(false); setDevice(null); setEditing(false); setClosed(true);
  };

  const key = sel ? scopeKey(sel.selector, scope) : "";
  const props = sel ? ctx.propsFor(key) : {};
  const pageEdits = ctx.edits.length;

  return (
    <div data-le-ui style={{ zoom: 'calc(1 / var(--z))' }}>
      {editing && hover && !sel && hover.rect && (
        <div data-le-ui className="fixed z-[10030] pointer-events-none border-2 border-[#faaf6a] bg-[#faaf6a]/10"
          style={{ left: hover.rect.left, top: hover.rect.top, width: hover.rect.width, height: hover.rect.height }}>
          <span className="absolute -top-6 left-0 bg-midnight text-white text-[11px] px-2 py-0.5 rounded whitespace-nowrap max-w-[360px] overflow-hidden text-ellipsis">Click to edit · {hover.label}</span>
        </div>
      )}
      {sel && selRect && (
        <div data-le-ui className="fixed z-[10030] pointer-events-none border-2 border-[#1a5fa8] shadow-[0_0_0_9999px_rgba(10,14,30,0.12)]"
          style={{ left: selRect.left, top: selRect.top, width: selRect.width, height: selRect.height }} data-testid="editor-selection-box" />
      )}

      {sel && (
        <EditorPanel
          el={sel.el}
          selector={sel.selector}
          label={sel.label}
          props={props}
          scope={scope}
          onScope={setScope}
          side={device ? "left" : "right"}
          onChange={(patch) => { setSaveMessage(null); ctx.setProps(key, sel.label, patch); }}
          onSave={save}
          saving={saving}
          unsaved={ctx.hasUnsavedEdits}
          saveMessage={saveMessage}
          onReset={() => ctx.resetSelector(key)}
          onClose={() => setSel(null)}
          onParent={() => { const p = sel.el.parentElement; if (p && p !== document.body) select(p); }}
          onChild={() => { const c = Array.from(sel.el.children).find((x) => !skip(x)); if (c) select(c); }}
          onDuplicate={async (sectionEl) => {
            if (!sectionEl) return;
            const s = cssPath(sectionEl);
            await ctx.addBlock(s, s);
            setSel(null);
            setTimeout(() => {
              document.querySelector(`le-block[data-le-block]:last-of-type`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 600);
          }}
          onMoveBlock={(id, dir) => { ctx.moveBlock(id, dir); setSel(null); }}
          onRemoveBlock={(id) => ctx.removeBlock(id)}
        />
      )}

      {themeOpen && (ctx.themeReady
        ? <ThemePanel theme={ctx.theme} onSave={ctx.saveTheme} onClose={() => setThemeOpen(false)} />
        : <div data-testid="theme-load-status" role={ctx.themeError ? 'alert' : 'status'} className="fixed left-3 top-16 z-[10050] max-w-[calc(100vw-24px)] rounded-xl bg-white border border-slate-200 shadow-2xl text-slate-900 p-5">
            {ctx.themeError ? 'Could not load your saved theme. Nothing has been changed.' : 'Loading saved theme…'}
            {ctx.themeError && <button data-testid="theme-load-retry" onClick={ctx.reloadTheme} className="ml-3 underline">Retry</button>}
            <button data-testid="theme-load-close" onClick={() => setThemeOpen(false)} className="ml-3 underline">Close</button>
          </div>)}
      {listOpen && (
        <EditsList
          edits={ctx.edits}
          onClose={() => setListOpen(false)}
          onDelete={(s) => ctx.resetSelector(s)}
          onUnhide={(e) => ctx.setProps(e.selector, e.label, { hidden: null })}
          onResetAll={() => { if (window.confirm("Remove every live edit on the entire site?")) ctx.resetAll(); }}
          onJump={(s) => {
            let el = null;
            try { el = document.querySelector(s); } catch { el = null; }
            if (!el) return;
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => select(el), 400);
          }}
        />
      )}

      {device && <DevicePreview device={device} path={pathname} edits={ctx.edits} onClose={() => setDevice(null)} />}
      {intro && <EditorIntro onDone={() => { markIntroSeen(); setIntro(false); }} />}

      <div data-le-ui data-testid="live-editor-toolbar"
        className="fixed bottom-3 left-3 z-[10060] flex flex-wrap max-w-[calc(100vw-24px)] items-center gap-1.5 rounded-2xl bg-[#12121f] text-white shadow-2xl border border-white/10 pl-3 pr-1.5 py-1.5">
        <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-white/60 font-semibold"><Wand2 size={13} className="text-[#faaf6a]" /> Live Editor</span>
        <button onClick={() => { setEditing((v) => !v); setSel(null); }} data-testid="live-editor-toggle"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${editing ? "bg-[#faaf6a] text-midnight" : "bg-white/15 hover:bg-white/25"}`}>
          {editing ? <><Square size={12} fill="currentColor" /> Stop editing</> : <><MousePointerClick size={13} /> Start editing</>}
        </button>
        <button onClick={() => { setThemeOpen((v) => !v); setListOpen(false); }} title="Site theme" data-testid="live-editor-theme"
          className="p-2 rounded-full hover:bg-white/15"><Palette size={14} /></button>
        <button onClick={() => { setListOpen((v) => !v); setThemeOpen(false); }} title="See every change on this page (and unhide hidden items)" data-testid="live-editor-list"
          className="flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-white/15 text-[11px]"><ListTree size={14} /> Changes</button>
        <button onClick={() => ctx.undo()} disabled={!ctx.historyLen} title="Undo last change" data-testid="live-editor-undo"
          className="flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-white/15 disabled:opacity-35 text-[11px]"><Undo2 size={14} /> Undo</button>
        <span className="w-px h-5 bg-white/15 mx-0.5" />
        <button onClick={() => setDevice(null)} title="Desktop" data-testid="live-editor-device-desktop"
          className={`p-2 rounded-full ${device ? "hover:bg-white/15" : "bg-white/20"}`}><Monitor size={14} /></button>
        <button onClick={() => setDevice(device === "tablet" ? null : "tablet")} title="Tablet preview" data-testid="live-editor-device-tablet"
          className={`p-2 rounded-full ${device === "tablet" ? "bg-white/20" : "hover:bg-white/15"}`}><Tablet size={14} /></button>
        <button onClick={() => setDevice(device === "phone" ? null : "phone")} title="Phone preview" data-testid="live-editor-device-phone"
          className={`p-2 rounded-full ${device === "phone" ? "bg-white/20" : "hover:bg-white/15"}`}><Smartphone size={14} /></button>
        <button onClick={() => setIntro(true)} title="How the editor works" data-testid="live-editor-help"
          className="p-2 rounded-full hover:bg-white/15"><HelpCircle size={14} /></button>
        <button onClick={() => { if (window.confirm("Undo all edits on this page?")) ctx.resetPage(); }} disabled={!ctx.editsReady} title="Reset this page" data-testid="live-editor-reset-page"
          className="p-2 rounded-full hover:bg-white/15"><RotateCcw size={14} /></button>
        <button onClick={save} disabled={saving || !ctx.editsReady || !ctx.hasUnsavedEdits} data-testid="live-editor-save" className="flex items-center gap-1 px-3 py-2 rounded-full bg-blue-700 text-white text-xs disabled:opacity-40"><Save size={13}/>{saving ? 'Saving…' : 'Save'}</button>
        <span className="text-[11px] text-white/70 pr-1" data-testid="live-editor-count">{!ctx.editsReady ? 'Loading saved edits…' : ctx.hasUnsavedEdits ? 'Unsaved preview' : `${pageEdits} edits saved to database`}</span>
        <span className="w-px h-5 bg-white/15 mx-0.5" />
        <button onClick={closeEditor} title="Close editor" data-testid="live-editor-close"
          className="p-2 rounded-full hover:bg-red-500/30 text-white/80 hover:text-white"><X size={14} /></button>
        {ctx.editsError && <p role="alert" data-testid="live-editor-load-error" className="text-xs w-full px-2 pb-1 text-red-200">
          Saved edits could not be loaded. Editing is paused to protect them. <button data-testid="live-editor-load-retry" onClick={ctx.reloadEdits} className="underline">Retry</button>
        </p>}
        {saveMessage && <span role={saveMessage.ok ? 'status' : 'alert'} data-testid="live-editor-save-message" className={`text-xs w-full px-2 pb-1 ${saveMessage.ok ? 'text-green-200' : 'text-red-200'}`}>{saveMessage.text}</span>}
      </div>
    </div>
  );
}
