import React, { useEffect, useState } from "react";
import { X, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { api, errMsg } from "../lib/api";

const EMPTY = { name: "", email: "", company: "", phone: "", message: "" };

const ContactModal = ({ open, onClose }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) { setForm(EMPTY); setError(""); setDone(false); setLoading(false); }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Please enter your name and email."); return; }
    setLoading(true);
    try {
      await api.post("/inquiries", form);
      setDone(true);
    } catch (err) { setError(errMsg(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="cm-overlay" onMouseDown={onClose} data-testid="contact-modal">
      <div className="cm-card" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Left brand panel */}
        <div className="cm-aside">
          <div className="cm-aside-glow" />
          <div className="cm-aside-grid" />
          <div className="relative z-10">
            <span className="cm-eyebrow">Let's Talk</span>
            <h3 className="cm-aside-title">Speak with an IT expert</h3>
            <p className="cm-aside-sub">
              Tell us where you want to go. We'll map the security, cloud, and infrastructure path to get you there — no pressure, no jargon.
            </p>
            <ul className="cm-list">
              <li><span className="cm-dot" />Response within one business day</li>
              <li><span className="cm-dot" />A real engineer, not a sales bot</li>
              <li><span className="cm-dot" />Your details stay private</li>
            </ul>
          </div>
        </div>

        {/* Right form panel */}
        <div className="cm-main">
          <button className="cm-close" onClick={onClose} aria-label="Close" data-testid="contact-close"><X size={18} /></button>

          {done ? (
            <div className="cm-success" data-testid="contact-success">
              <div className="cm-success-icon"><CheckCircle2 size={38} /></div>
              <h3 className="cm-success-title">Message on its way</h3>
              <p className="cm-success-sub">Thanks, {form.name.split(" ")[0] || "there"}. One of our experts will reach out shortly.</p>
              <button className="btn-amber mt-6" onClick={onClose} data-testid="contact-success-close">
                <span>Close</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
              </button>
            </div>
          ) : (
            <>
              <h3 className="cm-title">How can we help you?</h3>
              <p className="cm-desc">Share a few details and we'll get the right expert on it.</p>
              <form onSubmit={submit} className="cm-form">
                <div className="cm-row">
                  <div className="cm-field">
                    <label className="cm-label">Name*</label>
                    <input className="cm-input" data-testid="contact-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" autoFocus />
                  </div>
                  <div className="cm-field">
                    <label className="cm-label">Email*</label>
                    <input className="cm-input" data-testid="contact-email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" />
                  </div>
                </div>
                <div className="cm-row">
                  <div className="cm-field">
                    <label className="cm-label">Company</label>
                    <input className="cm-input" data-testid="contact-company" value={form.company} onChange={set("company")} placeholder="Acme Inc." />
                  </div>
                  <div className="cm-field">
                    <label className="cm-label">Phone</label>
                    <input className="cm-input" data-testid="contact-phone" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="cm-field">
                  <label className="cm-label">Message</label>
                  <textarea className="cm-input cm-textarea" data-testid="contact-message" rows={3} value={form.message} onChange={set("message")} placeholder="How can we help you?" />
                </div>
                {error && <p className="cm-error" data-testid="contact-error">{error}</p>}
                <button className="btn-amber cm-submit" disabled={loading} data-testid="contact-submit">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>{loading ? "Sending..." : "Let's Connect"}</span>
                  {!loading && <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
