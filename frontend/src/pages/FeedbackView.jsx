import React, { useEffect, useState, useCallback } from "react";
import { Trash2, Check, RotateCcw, Send, ExternalLink, Copy } from "lucide-react";
import { api, errMsg } from "../lib/api";
import { fmtTime, clientMessage } from "../lib/review";

const reviewLink = (page, id) => `${window.location.origin}${page}?review=1${id ? `&pin=${id}` : ""}`;

export const FeedbackView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("open");
  const [reply, setReply] = useState({});
  const [copied, setCopied] = useState("");
  const copy = async (what, text) => { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(""), 1500); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get("/feedback"); setItems(data); }
    catch (err) { alert(errMsg(err)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const patch = (data) => setItems((p) => p.map((x) => (x.id === data.id ? data : x)));
  const setStatus = async (id, status) => { try { patch((await api.patch(`/feedback/${id}`, { status })).data); } catch (err) { alert(errMsg(err)); } };
  const remove = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try { await api.delete(`/feedback/${id}`); setItems((p) => p.filter((x) => x.id !== id)); } catch (err) { alert(errMsg(err)); }
  };
  const sendReply = async (id) => {
    const text = (reply[id] || "").trim(); if (!text) return;
    try { patch((await api.post(`/feedback/${id}/replies`, { author: "Developer", text })).data); setReply((r) => ({ ...r, [id]: "" })); }
    catch (err) { alert(errMsg(err)); }
  };
  const shown = items.filter((i) => filter === "all" || i.status === filter).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const counts = { open: items.filter((i) => i.status === "open").length, resolved: items.filter((i) => i.status === "resolved").length, all: items.length };

  return (
    <div data-testid="editor-feedback">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-serif text-[26px] text-midnight font-semibold">Client Feedback {items.length ? `(${items.length})` : ""}</h2>
        <div className="flex gap-2">
          <button onClick={() => copy("link", reviewLink("/"))} className="btn-outline" data-testid="feedback-copy-link">
            <span className="btn-arrow"><Copy size={14} /></span><span>{copied === "link" ? "Copied!" : "Copy review link"}</span>
          </button>
          <button onClick={() => copy("msg", clientMessage(reviewLink("/")))} className="btn-amber btn-sm" data-testid="feedback-copy-message">
            <span>{copied === "msg" ? "Copied!" : "Copy message for client"}</span><span className="btn-arrow"><Copy size={12} /></span>
          </button>
        </div>
      </div>
      <p className="text-[13.5px] text-slatesage mb-4">Send the ready-made message (link + 5 simple steps) to your client by email or WhatsApp. In review mode they click any element and pin a comment; you reply here or on the page. Once published, the same works on your own domain.</p>
      <div className="flex gap-2 mb-5">
        {["open", "resolved", "all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} data-testid={`feedback-filter-${f}`}
            className={`px-3 py-1.5 text-[13px] rounded-full border capitalize ${filter === f ? "bg-navy text-white border-navy" : "border-powder text-slatesage hover:text-navy"}`}>{f} ({counts[f]})</button>
        ))}
      </div>
      {loading ? <p className="text-slatesage">Loading...</p> :
        shown.length === 0 ? <p className="text-slatesage" data-testid="feedback-empty">No {filter === "all" ? "" : filter} comments yet.</p> : (
        <div className="space-y-4">
          {shown.map((it) => (
            <div key={it.id} className={`bg-white border p-5 ${it.status === "resolved" ? "border-powder opacity-75" : "border-amber/60"}`} data-testid={`feedback-${it.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-midnight text-[16px] flex flex-wrap items-center gap-2">
                    {it.author}
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${it.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{it.status}</span>
                    <span className="text-slatesage font-normal text-[13px]">· {fmtTime(it.created_at)}</span>
                  </p>
                  <p className="text-[13px] text-slatesage mt-1 truncate">Page <b className="text-midnight">{it.page}</b>{it.label ? <> · {it.label}</> : null}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={reviewLink(it.page, it.id)} target="_blank" rel="noreferrer" className="btn-outline" data-testid={`feedback-open-${it.id}`}><span className="btn-arrow"><ExternalLink size={14} /></span><span>View on page</span></a>
                  <button onClick={() => setStatus(it.id, it.status === "resolved" ? "open" : "resolved")} className="btn-outline" data-testid={`feedback-status-${it.id}`}>
                    <span className="btn-arrow">{it.status === "resolved" ? <RotateCcw size={14} /> : <Check size={14} />}</span><span>{it.status === "resolved" ? "Reopen" : "Resolve"}</span>
                  </button>
                  <button onClick={() => remove(it.id)} className="btn-outline" data-testid={`feedback-delete-${it.id}`}><span className="btn-arrow"><Trash2 size={14} /></span><span>Delete</span></button>
                </div>
              </div>
              <p className="text-midnight text-[15px] leading-relaxed mt-3 pt-3 border-t border-powder whitespace-pre-wrap">{it.text}</p>
              {it.replies?.length > 0 && (
                <div className="mt-3 space-y-2 pl-3 border-l-2 border-powder">
                  {it.replies.map((r) => <p key={r.id} className="text-[14px] text-midnight"><b>{r.author}</b> <span className="text-slatesage text-[12px]">{fmtTime(r.created_at)}</span><br />{r.text}</p>)}
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <input value={reply[it.id] || ""} onChange={(e) => setReply((r) => ({ ...r, [it.id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && sendReply(it.id)}
                  placeholder="Reply to client…" className="flex-1 px-3 py-2 border border-powder text-[14px] focus:outline-none focus:border-navy" data-testid={`feedback-reply-input-${it.id}`} />
                <button onClick={() => sendReply(it.id)} className="btn-amber btn-sm" data-testid={`feedback-reply-send-${it.id}`}><span>Reply</span><span className="btn-arrow"><Send size={12} /></span></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
