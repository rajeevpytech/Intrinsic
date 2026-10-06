import { useEffect, useState } from "react";
import { X, Check, RotateCcw, Send, MapPin } from "lucide-react";
import { fmtTime } from "../../lib/review";

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));

export const usePopoverStyle = (pos, w = 340, h = 360) => {
  const [style, setStyle] = useState({});
  useEffect(() => {
    if (!pos) return;
    const left = clamp(pos.x + 18, 8, window.innerWidth - w - 8);
    const top = clamp(pos.y - 20, 8, window.innerHeight - h - 8);
    setStyle({ left, top, width: w });
  }, [pos, w, h]);
  return style;
};

export const ReviewThread = ({ pin, index, pos, author, onReply, onStatus, onClose }) => {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const style = usePopoverStyle(pos);
  const resolved = pin.status === "resolved";

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try { await onReply(pin.id, text.trim()); setText(""); } finally { setBusy(false); }
  };

  return (
    <div data-review-ui className="fixed z-[10001] bg-white border border-powder shadow-2xl rounded-lg overflow-hidden text-left" style={style} data-testid={`review-thread-${pin.id}`}>
      <div className="flex items-center justify-between px-4 py-2.5 bg-midnight text-white">
        <span className="flex items-center gap-2 text-[13px] font-semibold">
          <span className="w-5 h-5 rounded-full bg-amber text-midnight text-[11px] font-bold flex items-center justify-center">{index}</span>
          {resolved ? "Resolved" : "Open"}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => onStatus(pin.id, resolved ? "open" : "resolved")} title={resolved ? "Reopen" : "Mark resolved"}
            className="p-1.5 rounded hover:bg-white/15" data-testid={`review-thread-status-${pin.id}`}>
            {resolved ? <RotateCcw size={14} /> : <Check size={14} />}
          </button>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-white/15" data-testid="review-thread-close"><X size={14} /></button>
        </div>
      </div>
      {pin.label && <p className="px-4 pt-2.5 text-[11.5px] text-slatesage flex items-center gap-1.5 truncate"><MapPin size={12} className="shrink-0" />{pin.label}</p>}
      <div className="px-4 py-3 space-y-3 max-h-[220px] overflow-y-auto">
        <Msg author={pin.author} time={pin.created_at} text={pin.text} />
        {pin.replies?.map((r) => <Msg key={r.id} author={r.author} time={r.created_at} text={r.text} reply />)}
      </div>
      <form onSubmit={submit} className="flex items-end gap-2 px-3 py-2.5 border-t border-powder bg-[#f7f9fb]">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} placeholder={`Reply as ${author}…`}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(e); }}
          className="flex-1 resize-none text-[13.5px] px-3 py-2 border border-powder rounded bg-white focus:outline-none focus:border-navy" data-testid="review-reply-input" />
        <button type="submit" disabled={busy || !text.trim()} className="w-9 h-9 rounded bg-navy text-white flex items-center justify-center disabled:opacity-40" data-testid="review-reply-submit"><Send size={14} /></button>
      </form>
    </div>
  );
};

const Msg = ({ author, time, text, reply }) => (
  <div className={reply ? "pl-3 border-l-2 border-powder" : ""}>
    <p className="text-[12px] text-slatesage"><span className="font-semibold text-midnight">{author}</span> · {fmtTime(time)}</p>
    <p className="text-[14px] text-midnight leading-snug whitespace-pre-wrap mt-0.5">{text}</p>
  </div>
);

export const NewCommentBox = ({ pos, label, author, onSubmit, onCancel }) => {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const style = usePopoverStyle(pos, 340, 220);
  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try { await onSubmit(text.trim()); } finally { setBusy(false); }
  };
  return (
    <form data-review-ui onSubmit={submit} className="fixed z-[10001] bg-white border border-powder shadow-2xl rounded-lg overflow-hidden" style={style} data-testid="review-new-comment">
      <div className="px-4 py-2.5 bg-midnight text-white text-[13px] font-semibold flex items-center justify-between">
        New comment <button type="button" onClick={onCancel} className="p-1 rounded hover:bg-white/15" data-testid="review-new-cancel"><X size={14} /></button>
      </div>
      {label && <p className="px-4 pt-2.5 text-[11.5px] text-slatesage flex items-center gap-1.5 truncate"><MapPin size={12} className="shrink-0" />{label}</p>}
      <div className="p-3">
        <textarea autoFocus value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="e.g. Make the logo 10px bigger"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(e); }}
          className="w-full resize-none text-[14px] px-3 py-2 border border-powder rounded focus:outline-none focus:border-navy" data-testid="review-new-input" />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[12px] text-slatesage">as <b className="text-midnight">{author}</b></span>
          <button type="submit" disabled={busy || !text.trim()} className="btn-amber btn-sm disabled:opacity-50" data-testid="review-new-submit"><span>Post</span><span className="btn-arrow"><Send size={12} /></span></button>
        </div>
      </div>
    </form>
  );
};

export const NamePrompt = ({ onDone, initial = "" }) => {
  const [name, setName] = useState(initial);
  return (
    <div data-review-ui className="fixed inset-0 z-[10002] bg-midnight/60 flex items-center justify-center p-4">
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) onDone(name.trim()); }} className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6" data-testid="review-name-prompt">
        <h3 className="font-serif text-[22px] text-midnight font-semibold">{initial ? "Change your name" : "Welcome to review mode"}</h3>
        <p className="text-slatesage text-[14px] mt-1">Enter your name once so we know who left each comment.</p>
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full mt-4 px-3 py-2.5 border border-powder rounded text-[15px] focus:outline-none focus:border-navy" data-testid="review-name-input" />
        <button type="submit" disabled={!name.trim()} className="btn-amber w-full mt-3 justify-center disabled:opacity-50" data-testid="review-name-submit"><span>{initial ? "Save" : "Start reviewing"}</span></button>
      </form>
    </div>
  );
};

const STEPS = [
  ["Click “Add comment”", "The orange button at the bottom-right. Your cursor becomes a crosshair."],
  ["Click anything on the page", "Logo, heading, text, image, animation — the part you hover gets highlighted."],
  ["Type your note", "e.g. “Make the logo 10px bigger”. Press Enter to post."],
  ["Browse every page", "Menu links work normally. Drop pins on each section you want changed."],
];

export const IntroGuide = ({ onDone }) => (
  <div data-review-ui className="fixed inset-0 z-[10002] bg-midnight/60 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-7" data-testid="review-intro">
      <p className="text-[11px] uppercase tracking-[0.18em] text-navy font-semibold">Review mode</p>
      <h3 className="font-serif text-[24px] text-midnight font-semibold mt-1">How to leave feedback</h3>
      <ol className="mt-5 space-y-3.5">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="flex gap-3">
            <span className="w-6 h-6 shrink-0 rounded-full bg-amber text-midnight text-[12px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
            <div><p className="text-[15px] font-semibold text-midnight leading-tight">{t}</p><p className="text-[13.5px] text-slatesage mt-0.5">{d}</p></div>
          </li>
        ))}
      </ol>
      <p className="text-[12.5px] text-slatesage mt-5">Every comment becomes a numbered pin. Click a pin to read replies or mark it done. Use the <b>?</b> button on the toolbar to see this again.</p>
      <button onClick={onDone} className="btn-amber w-full mt-5 justify-center" data-testid="review-intro-done"><span>Got it, start reviewing</span></button>
    </div>
  </div>
);

export const HoverHighlight = ({ rect, label }) => {
  if (!rect) return null;
  const above = rect.top > 34;
  return (
    <div data-review-ui className="fixed z-[9999] pointer-events-none" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }} data-testid="review-hover-highlight">
      <div className="absolute inset-0 border-2 border-amber bg-amber/10 rounded-sm" />
      <span className={`absolute left-0 ${above ? "-top-7" : "-bottom-7"} bg-midnight text-white text-[11px] px-2 py-1 rounded whitespace-nowrap max-w-[420px] truncate`}>{label}</span>
    </div>
  );
};
