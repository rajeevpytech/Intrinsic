import React, { useEffect, useState } from "react";
import { X, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { api, errMsg } from "../lib/api";

const EMPTY = { name: "", email: "", company: "", phone: "", company_size: "", concern: "", current_provider: "", message: "" };
const SIZES = ["1–10 employees", "11–50 employees", "51–200 employees", "201–500 employees", "500+ employees"];
const CONCERNS = ["Ransomware & malware", "Regulatory compliance", "Cloud security", "Email & phishing", "Data backup & recovery", "Not sure — need guidance"];

const AssessmentModal = ({ open, onClose }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) { setForm(EMPTY); setError(""); setDone(false); setLoading(false); }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Please enter your name and work email."); return; }
    setLoading(true);
    try {
      await api.post("/inquiries", {
        name: form.name, email: form.email, company: form.company, phone: form.phone,
        message: form.message, type: "assessment",
        details: { company_size: form.company_size, primary_concern: form.concern, current_provider: form.current_provider },
      });
      setDone(true);
    } catch (err) { setError(errMsg(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="cm-overlay" onMouseDown={onClose} data-testid="assessment-modal">
      <div className="cm-card cm-card-assess" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {/* Left brand panel — assessment themed */}
        <div className="cm-aside cm-aside-assess">
          <div className="cm-aside-glow" />
          <div className="cm-aside-grid" />
          <div className="relative z-10">
            <div className="cm-shield"><ShieldCheck size={24} /></div>
            <span className="cm-eyebrow">Free Security Assessment</span>
            <h3 className="cm-aside-title">See where you stand</h3>
            <p className="cm-aside-sub">
              A no-cost review of your current security posture. We'll identify gaps across identity, endpoints, cloud, and backups — and hand you a clear, prioritized action plan.
            </p>
            <ul className="cm-list">
              <li><span className="cm-dot" />30-minute discovery call</li>
              <li><span className="cm-dot" />Risk scorecard, no obligation</li>
              <li><span className="cm-dot" />Prioritized remediation roadmap</li>
            </ul>
          </div>
        </div>

        {/* Right form */}
        <div className="cm-main">
          <button className="cm-close" onClick={onClose} aria-label="Close" data-testid="assessment-close"><X size={18} /></button>

          {done ? (
            <div className="cm-success" data-testid="assessment-success">
              <div className="cm-success-icon"><CheckCircle2 size={38} /></div>
              <h3 className="cm-success-title">Assessment requested</h3>
              <p className="cm-success-sub">Thanks, {form.name.split(" ")[0] || "there"}. A security specialist will reach out to schedule your assessment shortly.</p>
              <button className="btn-amber mt-6" onClick={onClose} data-testid="assessment-success-close">
                <span>Close</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
              </button>
            </div>
          ) : (
            <>
              <h3 className="cm-title">Request your assessment</h3>
              <p className="cm-desc">Tell us a little about your environment and we'll tailor the review.</p>
              <form onSubmit={submit} className="cm-form">
                <div className="cm-row">
                  <div className="cm-field">
                    <label className="cm-label">Name*</label>
                    <input className="cm-input" data-testid="assess-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" autoFocus />
                  </div>
                  <div className="cm-field">
                    <label className="cm-label">Work email*</label>
                    <input className="cm-input" data-testid="assess-email" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" />
                  </div>
                </div>
                <div className="cm-row">
                  <div className="cm-field">
                    <label className="cm-label">Company</label>
                    <input className="cm-input" data-testid="assess-company" value={form.company} onChange={set("company")} placeholder="Acme Inc." />
                  </div>
                  <div className="cm-field">
                    <label className="cm-label">Phone</label>
                    <input className="cm-input" data-testid="assess-phone" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="cm-row">
                  <div className="cm-field">
                    <label className="cm-label">Company size</label>
                    <select className="cm-input" data-testid="assess-size" value={form.company_size} onChange={set("company_size")}>
                      <option value="">Select...</option>
                      {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="cm-field">
                    <label className="cm-label">Primary concern</label>
                    <select className="cm-input" data-testid="assess-concern" value={form.concern} onChange={set("concern")}>
                      <option value="">Select...</option>
                      {CONCERNS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="cm-field">
                  <label className="cm-label">Anything specific we should know?</label>
                  <textarea className="cm-input cm-textarea" data-testid="assess-message" rows={2} value={form.message} onChange={set("message")} placeholder="Current setup, compliance needs, recent incidents..." />
                </div>
                {error && <p className="cm-error" data-testid="assessment-error">{error}</p>}
                <button className="btn-amber cm-submit" disabled={loading} data-testid="assessment-submit">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>{loading ? "Submitting..." : "Request Assessment"}</span>
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

export default AssessmentModal;
