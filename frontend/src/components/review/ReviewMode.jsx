import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquarePlus, X, Eye, EyeOff, LogOut, HelpCircle } from "lucide-react";
import { api } from "../../lib/api";
import { useModes } from "../../lib/modes";
import { isReviewMode, exitReviewMode, getReviewerName, setReviewerName, isReviewUi, cssPath, describeEl, pinViewportPos, introSeen, markIntroSeen } from "../../lib/review";
import { ReviewThread, NewCommentBox, NamePrompt, IntroGuide, HoverHighlight } from "./ReviewPanels";

const targetAt = (x, y) => document.elementsFromPoint(x, y).find((el) => !isReviewUi(el) && el !== document.documentElement && el !== document.body) || document.body;

export default function ReviewMode() {
  const { pathname, search } = useLocation();
  const [active, setActive] = useState(false);
  const [name, setName] = useState(getReviewerName());
  const [editName, setEditName] = useState(false);
  const [intro, setIntro] = useState(!introSeen());
  const [hover, setHover] = useState(null);
  const [pins, setPins] = useState([]);
  const [positions, setPositions] = useState({});
  const [showPins, setShowPins] = useState(true);
  const [showResolved, setShowResolved] = useState(false);
  const [armed, setArmed] = useState(false);
  const [draft, setDraft] = useState(null);
  const [openId, setOpenId] = useState(null);
  const raf = useRef(0);

  const modes = useModes();
  useEffect(() => { setActive(modes.review_enabled !== false && isReviewMode() && !pathname.startsWith("/admin")); }, [pathname, search, modes.review_enabled]);

  const load = useCallback(async () => {
    const { data } = await api.get("/feedback", { params: { page: pathname } });
    setPins(data);
  }, [pathname]);

  useEffect(() => { if (active) { load(); setDraft(null); setOpenId(null); } }, [active, load]);

  useEffect(() => {
    const id = new URLSearchParams(search).get("pin");
    if (id && pins.some((p) => p.id === id)) setOpenId(id);
  }, [search, pins]);

  const reposition = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const next = {};
      pins.forEach((p) => { next[p.id] = pinViewportPos(p); });
      setPositions(next);
    });
  }, [pins]);

  useEffect(() => {
    if (!active) return;
    reposition();
    const iv = setInterval(reposition, 800);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => { clearInterval(iv); window.removeEventListener("scroll", reposition, true); window.removeEventListener("resize", reposition); cancelAnimationFrame(raf.current); };
  }, [active, reposition]);

  useEffect(() => {
    if (!armed) return;
    const onClick = (e) => {
      if (isReviewUi(e.target)) return;
      e.preventDefault(); e.stopPropagation();
      const target = targetAt(e.clientX, e.clientY);
      const r = target.getBoundingClientRect();
      setDraft({
        selector: cssPath(target), label: describeEl(target),
        rel_x: r.width ? (e.clientX - r.left) / r.width : 0.5, rel_y: r.height ? (e.clientY - r.top) / r.height : 0.5,
        doc_x: e.clientX + window.scrollX, doc_y: e.clientY + window.scrollY,
        pos: { x: e.clientX, y: e.clientY },
      });
      setArmed(false); setOpenId(null); setHover(null);
    };
    const onMove = (e) => {
      if (isReviewUi(e.target)) { setHover(null); return; }
      const t = targetAt(e.clientX, e.clientY);
      const r = t.getBoundingClientRect();
      setHover({ rect: { left: r.left, top: r.top, width: r.width, height: r.height }, label: describeEl(t) });
    };
    const onKey = (e) => { if (e.key === "Escape") setArmed(false); };
    document.addEventListener("click", onClick, true);
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("keydown", onKey);
    document.body.style.cursor = "crosshair";
    return () => { document.removeEventListener("click", onClick, true); document.removeEventListener("mousemove", onMove, true); document.removeEventListener("keydown", onKey); document.body.style.cursor = ""; setHover(null); };
  }, [armed]);

  const openPin = (id) => {
    setOpenId(id); setDraft(null);
    const p = pins.find((x) => x.id === id);
    const pos = positions[id];
    if (p && pos && (pos.y < 80 || pos.y > window.innerHeight - 80)) window.scrollBy({ top: pos.y - window.innerHeight / 2, behavior: "smooth" });
  };

  const submitDraft = async (text) => {
    const { pos, ...rest } = draft;
    const { data } = await api.post("/feedback", { ...rest, page: pathname, author: name, text });
    setPins((p) => [...p, data]); setDraft(null); setOpenId(data.id);
  };
  const reply = async (id, text) => {
    const { data } = await api.post(`/feedback/${id}/replies`, { author: name, text });
    setPins((p) => p.map((x) => (x.id === id ? data : x)));
  };
  const setStatus = async (id, status) => {
    const { data } = await api.patch(`/feedback/${id}`, { status });
    setPins((p) => p.map((x) => (x.id === id ? data : x)));
  };

  if (!active) return null;
  if (!name) return <NamePrompt onDone={(n) => { setReviewerName(n); setName(n); }} />;
  if (editName) return <NamePrompt initial={name} onDone={(n) => { setReviewerName(n); setName(n); setEditName(false); }} />;
  if (intro) return <IntroGuide onDone={() => { markIntroSeen(); setIntro(false); }} />;

  const visible = pins.filter((p) => showResolved || p.status !== "resolved");
  const openPinObj = pins.find((p) => p.id === openId);
  const openCount = pins.filter((p) => p.status !== "resolved").length;

  return (
    <>
      {armed && <div data-review-ui className="fixed inset-0 z-[9998] pointer-events-none ring-[6px] ring-inset ring-amber/70" />}
      {armed && <HoverHighlight rect={hover?.rect} label={hover?.label} />}
      {armed && <div data-review-ui className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] bg-midnight text-white text-[13px] px-4 py-2 rounded-full shadow-lg" data-testid="review-armed-hint">Click the part you want to comment on · Esc to cancel</div>}

      {showPins && visible.map((p) => {
        const pos = positions[p.id]; if (!pos) return null;
        const idx = pins.indexOf(p) + 1;
        return (
          <button key={p.id} data-review-ui onClick={() => openPin(p.id)} style={{ left: pos.x, top: pos.y }} title={p.text}
            className={`fixed z-[9999] -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border-2 border-white shadow-lg text-[12px] font-bold flex items-center justify-center transition-transform hover:scale-110 ${p.status === "resolved" ? "bg-slatesage text-white" : "bg-amber text-midnight"} ${openId === p.id ? "ring-2 ring-navy scale-110" : ""}`}
            data-testid={`review-pin-${p.id}`}>{idx}</button>
        );
      })}

      {draft && <NewCommentBox pos={draft.pos} label={draft.label} author={name} onSubmit={submitDraft} onCancel={() => setDraft(null)} />}
      {openPinObj && positions[openId] && <ReviewThread pin={openPinObj} index={pins.indexOf(openPinObj) + 1} pos={positions[openId]} author={name} onReply={reply} onStatus={setStatus} onClose={() => setOpenId(null)} />}

      <div data-review-ui className="fixed bottom-5 right-5 z-[10000] flex items-center gap-1 bg-midnight text-white rounded-full shadow-2xl pl-4 pr-1.5 py-1.5" data-testid="review-toolbar">
        <button onClick={() => setEditName(true)} title="Change your name" className="text-[12px] text-white/70 hover:text-white mr-1 whitespace-nowrap" data-testid="review-name-btn">Reviewing as <b className="text-white">{name}</b></button>
        <button onClick={() => { setArmed((a) => !a); setDraft(null); }} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${armed ? "bg-white text-midnight" : "bg-amber text-midnight hover:bg-[#ffc48a]"}`} data-testid="review-add-btn">
          {armed ? <X size={14} /> : <MessageSquarePlus size={14} />}{armed ? "Cancel" : "Add comment"}
        </button>
        <button onClick={() => setShowPins((s) => !s)} title={showPins ? "Hide pins" : "Show pins"} className="p-2 rounded-full hover:bg-white/15" data-testid="review-toggle-pins">{showPins ? <Eye size={15} /> : <EyeOff size={15} />}</button>
        <button onClick={() => setShowResolved((s) => !s)} className={`text-[11px] px-2 py-1 rounded-full ${showResolved ? "bg-white/20" : "hover:bg-white/15"}`} data-testid="review-toggle-resolved">{openCount} open{pins.length - openCount ? ` · ${pins.length - openCount} done` : ""}</button>
        <button onClick={() => setIntro(true)} title="How it works" className="p-2 rounded-full hover:bg-white/15" data-testid="review-help"><HelpCircle size={15} /></button>
        <button onClick={() => { exitReviewMode(); setActive(false); }} title="Exit review mode" className="p-2 rounded-full hover:bg-white/15" data-testid="review-exit"><LogOut size={15} /></button>
      </div>
    </>
  );
}
