import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, MapPin, Phone, Mail, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { api, errMsg, imgUrl } from "../lib/api";

const Eyebrow = ({ children, color = "#12306e", line = "#f2a91c" }) => (
  <p className="ct-eyebrow" style={{ color }}><span className="ct-eyebrow-line" style={{ background: line }} />{children}</p>
);

/* ---------------- HERO ---------------- */
const HeroArcs = () => (
  <svg className="pointer-events-none absolute inset-0 w-full h-full" viewBox="0 0 1200 460" preserveAspectRatio="none" aria-hidden="true" data-testid="contact-hero-arcs">
    <g fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.32">
      <circle className="go-arc" cx="1020" cy="290" r="200" vectorEffect="non-scaling-stroke" />
      <circle className="go-arc" cx="1020" cy="290" r="300" vectorEffect="non-scaling-stroke" style={{ animationDelay: "-4s" }} />
      <line x1="1100" y1="0" x2="1100" y2="460" vectorEffect="non-scaling-stroke" />
      <line x1="640" y1="252" x2="1200" y2="252" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
    </g>
    <circle r="3" fill="#f2a91c">
      <animateMotion dur="11s" repeatCount="indefinite" path="M 820 290 a 200 200 0 1 1 400 0 a 200 200 0 1 1 -400 0" />
    </circle>
  </svg>
);

const Hero = () => (
  <section className="ct-hero relative overflow-hidden pt-[var(--nav-h)]" data-testid="contact-hero">
    <HeroArcs />
    <span className="ct-node hidden lg:block" style={{ left: "91.6%", top: "55%" }} />
    <div className="container-x relative z-10 pt-14 lg:pt-20 pb-14 lg:pb-16">
      <div className="animate-fade-up"><Eyebrow color="#ffffff">Contact</Eyebrow></div>
      <h1 className="font-serif text-white font-normal text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.02] tracking-[-0.01em] mt-5 max-w-[720px] animate-fade-up" style={{ animationDelay: "80ms" }}>
        Start a<br />Conversation<br />With Intrinsic
      </h1>
      <p className="text-white/90 text-[16px] sm:text-[17px] leading-[1.5] mt-7 max-w-[440px] animate-fade-up" style={{ animationDelay: "160ms" }}>We look forward to hearing from you and learning more about your organization and how we can support your technology environment.</p>
    </div>
  </section>
);

/* ---------------- FORM ---------------- */
const EMPTY = { first: "", last: "", company: "", email: "", phone: "", message: "" };

const Field = ({ k, label, form, set, type = "text", required, i, area }) => {
  const Tag = area ? "textarea" : "input";
  return (
    <label className={`ct-field ${form[k] ? "is-filled" : ""}`} style={{ "--i": i }} data-testid={`contact-field-${k}`}>
      <Tag type={area ? undefined : type} name={k} value={form[k]} onChange={set(k)} required={required} placeholder=" " rows={area ? 5 : undefined} className={area ? "min-h-[130px] resize-y" : ""} data-testid={`contact-input-${k}`} />
      <span className="ct-label">{label}{required ? " *" : ""}</span>
    </label>
  );
};

const ContactForm = ({ briefId }) => {
  const [form, setForm] = useState(EMPTY);
  const [brief, setBrief] = useState(null);
  const [briefLoading, setBriefLoading] = useState(!!briefId);
  const [download, setDownload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (!briefId) return;
    let active = true;
    api.get("/content/service-briefs").then(({ data }) => {
      if (!active) return;
      const selected = data.find(item => item.id === briefId && item.available !== false && item.has_file);
      if (!selected) { setError("This service brief is not available. Please return to Resources and choose another brief."); return; }
      setBrief(selected);
      setForm(current => ({ ...current, message: `I'd like to download ${selected.title}.` }));
    }).catch(() => { if (active) setError("Could not load this service brief. Please return to Resources and try again."); })
      .finally(() => { if (active) setBriefLoading(false); });
    return () => { active = false; };
  }, [briefId]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.first.trim() || !form.last.trim() || !form.company.trim() || !form.email.trim() || !form.message.trim()) { setError("Please complete the required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Please enter a valid email address."); return; }
    if (briefId && !brief) { setError("Please select an available service brief from Resources."); return; }
    setLoading(true);
    try {
      const payload = { name: `${form.first.trim()} ${form.last.trim()}`, email: form.email.trim(), company: form.company.trim(), phone: form.phone.trim(), message: form.message.trim() };
      if (briefId) {
        const { data } = await api.post("/brief-download", { ...payload, brief_id: briefId });
        setDownload({ url: imgUrl(data.file), title: data.title });
      } else {
        await api.post("/inquiries", { ...payload, type: "contact" });
      }
      setDone(true);
    } catch (err) { setError(errMsg(err)); } finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="ct-success" data-testid="contact-success">
        <CheckCircle size={40} strokeWidth={1.5} className="text-[#1a44c4]" />
        <p className="font-serif text-[#1a44c4] text-[28px] mt-4">Thank you — we've received your message.</p>
        <p className="text-[#4a5568] text-[15px] mt-2">A member of our team will follow up with you directly.</p>
        {download && <div className="mt-6" data-testid="contact-brief-ready">
          <p className="text-[#12306e] text-[15px] mb-3" data-testid="contact-brief-ready-title">Your brief is ready: {download.title}</p>
          <a href={download.url} download target="_blank" rel="noopener noreferrer" className="gc-hero-btn ct-btn" data-testid="contact-brief-download">Download the Brief <ArrowRight size={16} /></a>
        </div>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="contact-form">
      {briefId && <p className="sm:col-span-2 rounded border border-[#b9c8dd] bg-[#e8f0fa] p-4 text-[#12306e] text-sm" data-testid="contact-brief-notice">
        {briefLoading ? "Loading your selected brief…" : brief ? `Complete this form to download: ${brief.title}` : "No brief is available for this request."}
      </p>}
      <Field k="first" label="First Name" form={form} set={set} required i={0} />
      <Field k="last" label="Last Name" form={form} set={set} required i={1} />
      <div className="sm:col-span-2"><Field k="company" label="Company" form={form} set={set} required i={2} /></div>
      <Field k="email" label="Email" type="email" form={form} set={set} required i={3} />
      <Field k="phone" label="Phone" type="tel" form={form} set={set} i={4} />
      <div className="sm:col-span-2"><Field k="message" label="How can we help?" form={form} set={set} required area i={5} /></div>
      {error && <p className="sm:col-span-2 text-red-600 text-[13px]" data-testid="contact-error">{error}</p>}
      <div className="sm:col-span-2 pt-1">
        <button type="submit" disabled={loading || briefLoading || (!!briefId && !brief)} className="gc-hero-btn ct-btn disabled:opacity-60" data-testid="contact-submit">
          <span>{loading ? "Sending…" : briefId ? "Submit & Get the Brief" : "Send Message"}</span><ArrowRight size={16} strokeWidth={2.2} />
        </button>
      </div>
    </form>
  );
};

const Talk = ({ briefId }) => (
  <section id="contact-form-section" className="bg-white py-12 lg:py-16 scroll-mt-[var(--nav-h)]" data-testid="contact-talk">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-8 items-start">
      <Reveal className="lg:col-span-5 relative lg:pr-12">
        <span className="ct-rule hidden lg:block" />
        <Eyebrow>Talk to Our Team</Eyebrow>
        <h2 className="font-serif text-[#1a44c4] font-normal text-[38px] sm:text-[46px] lg:text-[54px] leading-[1.04] mt-4">Let's Talk About<br className="hidden sm:block" /> Your Technology</h2>
        <p className="text-[#3a4a63] text-[15.5px] leading-[1.5] mt-7 max-w-[380px]">Whether you have a question, want to discuss a specific requirement, or would like to learn more about Intrinsic's services, our team is available to talk.</p>
        <p className="text-[#3a4a63] text-[15.5px] leading-[1.5] mt-5 max-w-[380px]">Use the form to tell us a little about your organization and what you would like to discuss. A member of our team will follow up with you directly.</p>
      </Reveal>
      <Reveal className="lg:col-span-7 lg:pl-6" delay={120}>
        <ContactForm key={briefId || "contact"} briefId={briefId} />
      </Reveal>
    </div>
  </section>
);

/* ---------------- LOCATIONS ---------------- */
const Locations = () => (
  <section className="bg-[#e8f0fa] py-12 lg:py-16" data-testid="contact-locations">
    <div className="container-x">
      <Reveal><Eyebrow>Our Locations</Eyebrow></Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-7">
        {[
          { id: "new-york", city: "New York", street: "14 Wall Street, Suite 5C", locality: "New York, NY 10005" },
          { id: "new-jersey", city: "New Jersey", street: "46–48 Camden Avenue", locality: "Paterson, NJ 07501" },
          { id: "boston", city: "Boston", street: "75 State Street, Suite 100", locality: "Boston, MA 02109" },
          { id: "washington-dc", city: "Washington DC", street: "600 Massachusetts Ave NW, Suite #250", locality: "Washington, District of Columbia 20001" },
        ].map((location, i) => <Reveal key={location.id} className="ct-loc min-w-0" delay={60 + i * 60} data-testid={`contact-location-${location.id}`}>
          <MapPin size={22} strokeWidth={1.7} className="text-[#1a44c4] shrink-0" />
          <div>
            <p className="text-[#1a44c4] font-bold text-[16px]" data-testid={`contact-location-${location.id}-city`}>{location.city}</p>
            <p className="text-[#3a4a63] text-[15px] leading-[1.5] mt-2 whitespace-pre-line" data-testid={`contact-location-${location.id}-address`}>{`${location.street}\n${location.locality}`}</p>
          </div>
        </Reveal>)}
      </div>
      <Reveal className="flex flex-col sm:flex-row sm:flex-wrap gap-5 sm:gap-10 pt-7 mt-8 border-t border-[#b9c8dd] min-w-0" delay={220}>
        <a href="tel:2126434808" className="ct-loc ct-link" data-testid="contact-phone"><Phone size={22} strokeWidth={1.7} className="text-[#1a44c4] shrink-0" /><span className="text-[#12306e] text-[15.5px]">212.643.4808</span></a>
        <a href="mailto:consulting@intrinsicamerica.com" className="ct-loc ct-link min-w-0" data-testid="contact-email"><Mail size={22} strokeWidth={1.7} className="text-[#1a44c4] shrink-0" /><span className="text-[#12306e] text-[15.5px] break-all">consulting@intrinsicamerica.com</span></a>
      </Reveal>
    </div>
  </section>
);

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  return (
  <div className="bg-white page-in" data-testid="contact-page">
    <ScrollProgress />
    <Navbar />
    <main>
      <Hero />
      <Talk briefId={searchParams.get("brief")} />
      <Locations />
    </main>
    <Footer />
  </div>
  );
};

export default ContactPage;
