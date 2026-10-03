import React, { useState } from "react";
import { ArrowRight, ShieldCheck, CheckCircle2, Loader2, Search, ListChecks, Route as RouteIcon, Clock, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { api, errMsg } from "../lib/api";

const EMPTY = { name: "", email: "", company: "", phone: "", company_size: "", concern: "", message: "" };
const SIZES = ["1–10 employees", "11–50 employees", "51–200 employees", "201–500 employees", "500+ employees"];
const CONCERNS = ["Ransomware & malware", "Regulatory compliance", "Cloud security", "Email & phishing", "Data backup & recovery", "Cyber insurance requirements", "Not sure — need guidance"];

const STEPS = [
  { Icon: Search, title: "Discovery Call", body: "A 30-minute conversation to understand your environment, priorities, and any recent concerns." },
  { Icon: ShieldCheck, title: "Posture Review", body: "We assess controls across identity, endpoints, email, cloud, network, and backups." },
  { Icon: ListChecks, title: "Risk Scorecard", body: "You receive a clear scorecard highlighting gaps, exposure, and business impact." },
  { Icon: RouteIcon, title: "Prioritized Roadmap", body: "A practical, prioritized action plan — with or without working together." },
];

const RECEIVE = [
  "A clear picture of your current security posture",
  "Identified vulnerabilities across critical systems",
  "Exposure evaluated against real business impact",
  "Alignment with frameworks like HIPAA, NYDFS Part 500, SOC 2, and NIST CSF",
  "A prioritized remediation roadmap you can act on",
  "Guidance for cyber-insurance readiness",
];

const TRUST = [
  { k: "24/7", v: "Security operations coverage" },
  { k: "< 1 day", v: "Typical response to your request" },
  { k: "No cost", v: "No-obligation assessment" },
];

const AssessmentForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
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
        details: { company_size: form.company_size, primary_concern: form.concern, source: "assessment-landing-page" },
      });
      setDone(true);
    } catch (err) { setError(errMsg(err)); }
    finally { setLoading(false); }
  };

  const field = "w-full bg-white border border-powder px-4 py-3 text-[15px] text-midnight placeholder-slate-400 focus:outline-none focus:border-royal transition-colors";
  const label = "block text-[12px] font-bold tracking-[0.06em] uppercase text-slatesage mb-1.5";

  if (done) {
    return (
      <div className="bg-white shadow-[0_40px_80px_-40px_rgba(8,76,152,0.6)] p-8 lg:p-10 text-center" data-testid="assessment-success">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto"><CheckCircle2 size={36} /></div>
        <h3 className="font-serif text-royal text-[26px] font-semibold mt-5">Request received</h3>
        <p className="text-[#4a5259] text-[15px] leading-[1.65] mt-3">Thanks, {form.name.split(" ")[0] || "there"}. A security specialist will reach out within one business day to schedule your assessment.</p>
        <a href="/" className="btn-amber mt-7 inline-flex" data-testid="assessment-success-home"><span>Back to Home</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-[0_40px_80px_-40px_rgba(8,76,152,0.6)]" data-testid="assessment-form-card">
      <div className="bg-royal text-white px-7 py-5">
        <p className="font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-amber">Free Security Risk Assessment</p>
        <p className="font-serif text-[21px] font-semibold mt-1">Request your assessment</p>
      </div>
      <form onSubmit={submit} className="p-7 lg:p-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={label}>Name*</label><input className={field} data-testid="assess-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" /></div>
          <div><label className={label}>Work email*</label><input className={field} type="email" data-testid="assess-email" value={form.email} onChange={set("email")} placeholder="jane@company.com" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={label}>Company</label><input className={field} data-testid="assess-company" value={form.company} onChange={set("company")} placeholder="Acme Inc." /></div>
          <div><label className={label}>Phone <span className="text-slate-400 normal-case font-normal">(optional)</span></label><input className={field} data-testid="assess-phone" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={label}>Company size</label>
            <select className={field} data-testid="assess-size" value={form.company_size} onChange={set("company_size")}>
              <option value="">Select…</option>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div><label className={label}>Biggest security concern</label>
            <select className={field} data-testid="assess-concern" value={form.concern} onChange={set("concern")}>
              <option value="">Select…</option>
              {CONCERNS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div><label className={label}>Anything specific we should know?</label>
          <textarea className={`${field} resize-none`} rows={3} data-testid="assess-message" value={form.message} onChange={set("message")} placeholder="Current setup, compliance needs, recent incidents…" />
        </div>
        {error && <p className="text-red-600 text-[13.5px]" data-testid="assessment-error">{error}</p>}
        <button className="btn-amber w-full justify-center" disabled={loading} data-testid="assessment-submit">
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          <span>{loading ? "Submitting…" : "Request My Assessment"}</span>
          {!loading && <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>}
        </button>
      </form>
    </div>
  );
};

const Hero = () => (
  <section className="relative text-white overflow-hidden pt-[var(--nav-h)] hero-grain" data-testid="assessment-hero">
    <div className="absolute inset-0" style={{ background: "#00388e" }} />
    <div className="absolute -top-24 -right-16 w-[520px] h-[520px] rounded-full bg-amber/10 blur-3xl float-a" />
    <div className="container-x relative z-10 pt-16 lg:pt-20 pb-16 lg:pb-24 grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-6 max-w-[620px]">
        <p className="cyber-eyebrow text-white/85 inline-flex items-center gap-4 animate-fade-up">Free Security Risk Assessment <span className="inline-block w-14 h-px bg-[#f2a91c]" /></p>
        <h1 className="cyber-h1 text-white mt-6 animate-fade-up" style={{ animationDelay: "80ms" }}>Know exactly where your business stands.</h1>
        <p className="cyber-p text-white/95 mt-6 animate-fade-up" style={{ animationDelay: "150ms" }}>Every organization carries risk. A structured assessment shows you where — across identity, endpoints, cloud, email, and backups — and what to do about it first.</p>
        <ul className="mt-8 space-y-3 animate-fade-up" style={{ animationDelay: "220ms" }}>
          {["A no-cost review of your current security posture", "A clear, prioritized action plan you can keep", "No obligation — the roadmap is yours either way"].map((t) => (
            <li key={t} className="flex gap-3 text-white/90 text-[15.5px]"><CheckCircle2 size={19} className="text-amber shrink-0 mt-0.5" />{t}</li>
          ))}
        </ul>
        <div className="grid grid-cols-3 gap-6 mt-10 max-w-[440px] animate-fade-up" style={{ animationDelay: "300ms" }}>
          {TRUST.map((s) => (
            <div key={s.k}><p className="font-serif text-amber text-[24px] font-semibold leading-none">{s.k}</p><p className="text-white/70 text-[12px] leading-tight mt-1.5">{s.v}</p></div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-6 animate-fade-up" style={{ animationDelay: "200ms" }} id="request">
        <AssessmentForm />
      </div>
    </div>
  </section>
);

const Process = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="assessment-process">
    <div className="container-x">
      <Reveal className="max-w-[640px] mb-14">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-4">How It Works</p>
        <h2 className="font-serif text-royal font-semibold text-[30px] sm:text-[40px] leading-[1.12]">A simple, structured path to clarity</h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-powder border border-powder">
        {STEPS.map(({ Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 80} className="bg-white">
            <div className="h-full p-7 relative" data-testid={`assessment-step-${i}`}>
              <span className="font-serif text-powder text-[40px] font-semibold leading-none">0{i + 1}</span>
              <span className="inline-flex w-11 h-11 items-center justify-center bg-royal/8 text-royal mt-3"><Icon size={20} /></span>
              <h3 className="font-serif text-royal font-semibold text-[19px] mt-4">{title}</h3>
              <p className="text-slatesage text-[14px] leading-[1.6] mt-2.5">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const Receive = () => (
  <section className="bg-ice py-12 lg:py-16" data-testid="assessment-receive">
    <div className="container-x grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <Reveal className="lg:col-span-5">
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-4">What You'll Receive</p>
        <h2 className="font-serif text-royal font-semibold text-[30px] sm:text-[40px] leading-[1.12]">Insight you can act on — not a sales pitch</h2>
        <p className="text-[#4a5259] text-[16px] leading-[1.7] mt-6">The assessment is designed to give you a genuine, useful view of your risk. You keep the findings and the roadmap regardless of whether we work together.</p>
        <a href="#request" className="btn-amber mt-8 inline-flex" data-testid="receive-cta"><span>Start My Assessment</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
      </Reveal>
      <div className="lg:col-span-7">
        <div className="grid sm:grid-cols-2 gap-4">
          {RECEIVE.map((r, i) => (
            <Reveal key={r} delay={i * 60}>
              <div className="flex gap-4 bg-white border border-powder p-5 h-full" data-testid={`assessment-receive-${i}`}>
                <CheckCircle2 size={20} className="text-amber shrink-0 mt-0.5" />
                <p className="text-[#2f3a42] text-[14.5px] leading-[1.55]">{r}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Reassure = () => (
  <section className="relative text-white py-12 lg:py-16 overflow-hidden hero-grain" data-testid="assessment-reassure">
    <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, #24413b 0%, #2f5149 55%, #3c665b 100%)" }} />
    <div className="container-x relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex items-center gap-5">
        <span className="inline-flex w-14 h-14 items-center justify-center rounded-full border border-amber/60 text-amber shrink-0"><Clock size={24} /></span>
        <div>
          <h2 className="font-serif text-white text-[24px] sm:text-[28px] font-semibold">Roughly 30 minutes. Zero obligation.</h2>
          <p className="text-white/80 text-[15px] mt-1.5">Start with a conversation. Walk away with a plan — even if you go it alone.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {["HIPAA", "NYDFS Part 500", "SOC 2", "NIST CSF"].map((c) => (
          <span key={c} className="inline-flex items-center gap-2 border border-white/25 px-3.5 py-2 text-[11px] font-bold tracking-[0.12em] uppercase text-white/90"><FileText size={13} className="text-amber" />{c}</span>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="bg-white py-12 lg:py-16 text-center" data-testid="assessment-cta">
    <div className="container-x max-w-[720px]">
      <Reveal>
        <h2 className="font-serif text-royal font-semibold text-[32px] sm:text-[42px] leading-[1.1]">Ready to see your risk clearly?</h2>
        <p className="text-[#4a5259] text-[17px] leading-relaxed mt-5 mb-9">Request your free security risk assessment and get a prioritized plan for a more resilient business.</p>
        <a href="#request" className="btn-amber inline-flex" data-testid="assessment-bottom-cta"><span>Request My Assessment</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
      </Reveal>
    </div>
  </section>
);

export default function AssessmentPage() {
  return (
    <div className="bg-white page-in" data-testid="assessment-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Process />
        <Receive />
        <Reassure />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
