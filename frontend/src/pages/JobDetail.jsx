import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { ArrowLeft, ArrowRight, MapPin, Briefcase, Tag, CheckCircle2, Upload, Loader2, Check } from "lucide-react";
import { BACKEND, errMsg, api } from "../lib/api";
import axios from "axios";

const Section = ({ title, items }) => (
  <div className="mt-8">
    <h3 className="font-serif text-[22px] text-midnight font-semibold">{title}</h3>
    <ul className="mt-4 space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-3 text-slatesage text-[15.5px] leading-relaxed">
          <Check size={18} className="text-navy shrink-0 mt-0.5" strokeWidth={2.5} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  </div>
);

const JobDetail = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(undefined);
  useEffect(() => {
    api.get("/content/jobs").then(({ data }) => setJob(data.find((j) => j.slug === slug && j.published !== false) || null)).catch(() => setJob(null));
  }, [slug]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", cover_letter: "" });
  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const scrollToApplication = useCallback((behavior = 'smooth') => {
    const target = document.getElementById('apply');
    const header = document.querySelector('[data-testid="site-header"]');
    if (!target || !header) return;
    const top = window.scrollY + target.getBoundingClientRect().top - header.getBoundingClientRect().height - 16;
    window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : behavior });
  }, []);
  useEffect(() => {
    if (!job || window.location.hash !== '#apply') return;
    let active = true;
    document.fonts.ready.then(() => { if (active) requestAnimationFrame(() => scrollToApplication('instant')); });
    return () => { active = false; };
  }, [job, scrollToApplication]);
  const applyClick = event => {
    event.preventDefault();
    window.history.replaceState(window.history.state, '', '#apply');
    document.querySelector('[data-testid="job-application-heading"]')?.focus({ preventScroll: true });
    scrollToApplication();
  };

  if (job === undefined) return <div className="bg-ice min-h-screen page-in"><Navbar /></div>;
  if (!job) {
    return (
      <div className="bg-ice min-h-screen page-in">
        <Navbar />
        <div className="container-x pt-40 pb-40 text-center">
          <h1 className="font-serif text-midnight text-[36px] font-semibold">Role not found</h1>
          <Link to="/careers" className="btn-amber mt-8 inline-flex"><span className="btn-arrow"><ArrowLeft size={14} /></span><span>Back to Careers</span></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Please enter your name and email."); return; }
    if (!consent) { setError("Please agree to the storage and handling of your data."); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("role", job.title);
      fd.append("cover_letter", form.cover_letter);
      if (file) fd.append("resume", file);
      await axios.post(`${BACKEND}/api/applications`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setDone(true);
    } catch (err) { setError(errMsg(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-ice page-in">
      <ScrollProgress />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative hero-grain overflow-hidden pt-[112px] pb-16" style={{ background: "#00388e" }}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="container-x relative z-10">
            <Link to="/careers" className="inline-flex items-center gap-2 text-white/75 hover:text-amber transition-colors text-[14px] mb-6" data-testid="job-back">
              <ArrowLeft size={16} /> All openings
            </Link>
            <p className="eyebrow text-[#f2a91c] mb-3">{job.category}</p>
            <h1 className="font-serif font-semibold text-[36px] sm:text-[50px] leading-[1.05] max-w-[820px]">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-white/85 text-[14.5px]">
              <span className="inline-flex items-center gap-2"><Briefcase size={16} /> {job.type}</span>
              <span className="inline-flex items-center gap-2"><MapPin size={16} /> {job.location}</span>
              <span className="inline-flex items-center gap-2"><Tag size={16} /> {job.category}</span>
            </div>
            <a href="#apply" onClick={applyClick} className="btn-amber mt-8" data-testid="job-apply-scroll">
              <span>Apply for this position</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
            </a>
          </div>
        </section>

        {/* Body */}
        <section className="py-12 lg:py-16">
          <div className="container-x grid lg:grid-cols-[1.4fr_1fr] gap-14">
            {/* Details */}
            <Reveal>
              <div>
                <h2 className="font-serif text-navy text-[26px] font-semibold">Overview</h2>
                <p className="text-slatesage text-[16px] leading-[1.8] mt-3">{job.overview}</p>
                <Section title="What you'll do" items={job.responsibilities} />
                <Section title="Who you are" items={job.requirements} />
                {job.preferred?.length > 0 && <Section title="Preferred qualifications" items={job.preferred} />}
              </div>
            </Reveal>

            {/* Application form */}
            <div id="apply" data-testid="job-application-anchor" style={{ scrollMarginTop: 'calc((var(--nav-h) + 16px) * var(--z))' }}>
              <div data-testid="job-application-card" className="bg-white border border-powder/70 p-7 lg:p-8 lg:sticky lg:top-[calc(var(--nav-h)+16px)] shadow-[0_24px_60px_-40px_rgba(8,76,152,0.5)]">
                {done ? (
                  <div className="text-center py-6" data-testid="application-success">
                    <div className="cm-success-icon mx-auto"><CheckCircle2 size={36} /></div>
                    <h3 className="font-serif text-[24px] text-midnight font-semibold mt-3">Application received</h3>
                    <p className="text-slatesage text-[14.5px] mt-2">Thanks, {form.name.split(" ")[0] || "there"}! We'll review your application and be in touch soon.</p>
                    <Link to="/careers" className="btn-outline mt-6 inline-flex"><span>Browse more roles</span><span className="btn-arrow"><ArrowRight size={14} /></span></Link>
                  </div>
                ) : (
                  <>
                    <h3 data-testid="job-application-heading" tabIndex={-1} className="font-serif text-[24px] text-midnight font-semibold">Apply for this position</h3>
                    <p className="text-slatesage text-[13.5px] mt-1 mb-5">Fields marked * are required.</p>
                    <form onSubmit={submit} className="space-y-4">
                      <div>
                        <label className="cm-label">Full name*</label>
                        <input className="cm-input" data-testid="app-name" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
                      </div>
                      <div>
                        <label className="cm-label">Email*</label>
                        <input className="cm-input" type="email" data-testid="app-email" value={form.email} onChange={set("email")} placeholder="jane@email.com" />
                      </div>
                      <div>
                        <label className="cm-label">Phone*</label>
                        <input className="cm-input" data-testid="app-phone" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" />
                      </div>
                      <div>
                        <label className="cm-label">Cover letter*</label>
                        <textarea className="cm-input cm-textarea" rows={4} data-testid="app-cover" value={form.cover_letter} onChange={set("cover_letter")} placeholder="Tell us why you're a great fit..." />
                      </div>
                      <div>
                        <label className="cm-label">Upload CV / Resume <span className="text-slatesage font-normal normal-case tracking-normal">(.pdf, .doc, .docx)</span></label>
                        <label className="flex items-center gap-3 border border-dashed border-powder px-4 py-3 cursor-pointer hover:border-navy transition-colors" data-testid="app-resume-label">
                          <Upload size={18} className="text-navy" />
                          <span className="text-[14px] text-slatesage truncate">{file ? file.name : "Choose a file"}</span>
                          <input type="file" accept=".pdf,.doc,.docx" className="hidden" data-testid="app-resume" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        </label>
                      </div>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="w-4 h-4 mt-0.5 accent-navy" data-testid="app-consent" />
                        <span className="text-[13px] text-slatesage leading-relaxed">I agree with the storage and handling of my data by this website.*</span>
                      </label>
                      {error && <p className="cm-error" data-testid="application-error">{error}</p>}
                      <button className="btn-amber w-full justify-center" disabled={loading} data-testid="application-submit">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                        <span>{loading ? "Submitting..." : "Submit Application"}</span>
                        {!loading && <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
