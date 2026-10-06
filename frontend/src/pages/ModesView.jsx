import React, { useEffect, useState } from "react";
import { PenLine, MessageSquare, Trash2, Link2, RotateCcw } from "lucide-react";
import { api, errMsg } from "../lib/api";
import { setModesCache } from "../lib/modes";

const Toggle = ({ on, onChange, id }) => (
  <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} data-testid={id}
    className={`relative w-12 h-7 rounded-full transition-colors ${on ? "bg-navy" : "bg-powder"}`}>
    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

const Row = ({ Icon, title, desc, children, id }) => (
  <div className="bg-white border border-powder p-5 flex items-start justify-between gap-6" data-testid={id}>
    <div className="flex items-start gap-4">
      <span className="text-navy mt-0.5"><Icon size={22} strokeWidth={1.7} /></span>
      <div>
        <p className="font-semibold text-[15px] text-midnight">{title}</p>
        <p className="text-[13px] text-slatesage mt-1 max-w-[520px]">{desc}</p>
      </div>
    </div>
    <div className="shrink-0 flex items-center gap-2">{children}</div>
  </div>
);

export const ModesView = () => {
  const [modes, setModes] = useState({ editor_enabled: true, review_enabled: true });
  const [stats, setStats] = useState({ live_edits: 0, live_blocks: 0, feedback: 0 });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const [m, s] = await Promise.all([api.get("/modes"), api.get("/modes/stats")]);
      setModes(m.data); setStats(s.data);
    } catch (err) { setMsg({ ok: false, text: errMsg(err) }); }
  };
  useEffect(() => { load(); }, []);

  const flash = (text, ok = true) => { setMsg({ ok, text }); setTimeout(() => setMsg(null), 3500); };

  const toggle = async (key, val) => {
    try {
      const { data } = await api.put("/modes", { [key]: val });
      setModes(data); setModesCache(data);
      flash(`${key === "editor_enabled" ? "Live editor" : "Review mode"} turned ${val ? "on" : "off"}.`);
    } catch (err) { flash(errMsg(err), false); }
  };

  const run = async (label, fn) => {
    if (!window.confirm(`${label}? This cannot be undone.`)) return;
    setBusy(true);
    try { await fn(); await load(); flash(`${label} — done.`); } catch (err) { flash(errMsg(err), false); } finally { setBusy(false); }
  };

  const reviewLink = `${window.location.origin}/?review=1`;

  return (
    <div data-testid="editor-modes" className="max-w-[820px] space-y-4">
      <h2 className="font-serif text-[26px] text-midnight">Editor &amp; Review Controls</h2>
      <p className="text-[14px] text-slatesage -mt-2">Switch the on-page tools on or off for everyone, and clean up saved edits or reviewer comments.</p>

      <Row Icon={PenLine} id="mode-editor" title="Live Visual Editor" desc="When on, admins see the on-page editor toolbar while browsing the site. Turn off to hide it (saved edits stay applied for visitors).">
        <span className="text-[12px] font-semibold text-slatesage uppercase tracking-wider" data-testid="mode-editor-state">{modes.editor_enabled ? "On" : "Off"}</span>
        <Toggle id="toggle-editor" on={!!modes.editor_enabled} onChange={(v) => toggle("editor_enabled", v)} />
      </Row>

      <Row Icon={MessageSquare} id="mode-review" title="Client Review Mode" desc="When on, anyone opening the site with ?review=1 can pin comments on pages. Turn off to disable commenting for reviewers.">
        <span className="text-[12px] font-semibold text-slatesage uppercase tracking-wider" data-testid="mode-review-state">{modes.review_enabled ? "On" : "Off"}</span>
        <Toggle id="toggle-review" on={!!modes.review_enabled} onChange={(v) => toggle("review_enabled", v)} />
      </Row>

      <Row Icon={Link2} id="mode-review-link" title="Reviewer link" desc={reviewLink}>
        <button className="btn-outline" data-testid="copy-review-link" onClick={() => { navigator.clipboard?.writeText(reviewLink); flash("Reviewer link copied."); }}><span>Copy link</span></button>
      </Row>

      <h3 className="font-serif text-[20px] text-midnight pt-4">Delete &amp; reset</h3>

      <Row Icon={Trash2} id="delete-live-edits" title={`Live editor changes (${stats.live_edits})`} desc="Remove every text, style and image override saved from the live editor across all pages. Pages return to their original design.">
        <button disabled={busy || !stats.live_edits} className="btn-outline disabled:opacity-40" data-testid="delete-live-edits-btn" onClick={() => run("Delete all live editor changes", () => api.delete("/live-edits", { params: { path: "*" } }))}><span className="btn-arrow"><Trash2 size={14} /></span><span>Delete all</span></button>
      </Row>

      <Row Icon={Trash2} id="delete-live-blocks" title={`Duplicated sections (${stats.live_blocks})`} desc="Remove sections that were duplicated with the live editor.">
        <button disabled={busy || !stats.live_blocks} className="btn-outline disabled:opacity-40" data-testid="delete-live-blocks-btn" onClick={() => run("Delete all duplicated sections", () => api.delete("/live-blocks"))}><span className="btn-arrow"><Trash2 size={14} /></span><span>Delete all</span></button>
      </Row>

      <Row Icon={Trash2} id="delete-feedback" title={`Reviewer comments (${stats.feedback})`} desc="Delete every pinned comment left by reviewers on all pages.">
        <button disabled={busy || !stats.feedback} className="btn-outline disabled:opacity-40" data-testid="delete-feedback-btn" onClick={() => run("Delete all reviewer comments", () => api.delete("/feedback"))}><span className="btn-arrow"><Trash2 size={14} /></span><span>Delete all</span></button>
      </Row>

      <Row Icon={RotateCcw} id="reset-theme" title="Theme overrides" desc="Reset global colours and fonts changed in the live editor back to the site defaults.">
        <button disabled={busy} className="btn-outline" data-testid="reset-theme-btn" onClick={() => run("Reset theme to defaults", () => api.put("/theme", {}))}><span className="btn-arrow"><RotateCcw size={14} /></span><span>Reset</span></button>
      </Row>

      {msg && <p className={`text-[13px] ${msg.ok ? "text-green-600" : "text-red-600"}`} data-testid="modes-message">{msg.text}</p>}
    </div>
  );
};
