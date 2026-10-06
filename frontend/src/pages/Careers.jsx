import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { ArrowRight, MapPin, Briefcase, Heart, GraduationCap, Clock, Sparkles } from "lucide-react";
import { api } from "../lib/api";

const PERKS = [
  { Icon: Heart, title: "Health & wellness", body: "Comprehensive medical, dental, and vision from day one." },
  { Icon: GraduationCap, title: "Growth budget", body: "Annual stipend for certifications, courses, and conferences." },
  { Icon: Clock, title: "Flexible schedules", body: "Own your calendar with remote-friendly, results-first work." },
  { Icon: Sparkles, title: "Real impact", body: "Small teams, big ownership — your work is seen and felt." },
];

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => { api.get("/content/jobs").then(({ data }) => setJobs(data.filter((j) => j.published !== false))).catch(() => {}); }, []);
  return (
    <div className="bg-ice page-in">
      <ScrollProgress />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative hero-grain overflow-hidden pt-[var(--nav-h)]" style={{ background: "#00388e" }}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
          <div className="container-x relative z-10 max-w-[820px] pt-16 lg:pt-24 pb-20 lg:pb-28">
            <p className="eyebrow text-[#f2a91c] mb-5">Careers</p>
            <h1 className="font-serif font-semibold text-[40px] sm:text-[58px] leading-[1.04]">Build a career that protects what matters.</h1>
            <p className="text-white/80 text-[17px] leading-relaxed mt-7 max-w-[620px]">
              We're always on the lookout for talent to join our journey. Explore our open roles and become
              part of a team that treats technology as a craft and clients as partners.
            </p>
            <a href="#openings" className="btn-amber mt-9" data-testid="careers-view-openings">
              <span>View Open Roles</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
            </a>
          </div>
        </section>

        {/* Perks */}
        <section className="py-12 lg:py-16">
          <div className="container-x">
            <Reveal><h2 className="font-serif text-midnight font-semibold text-[34px] sm:text-[46px] max-w-[620px]">Why you'll love it here</h2></Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {PERKS.map(({ Icon, title, body }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="bg-white border border-powder/70 p-7 h-full hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgba(8,76,152,0.5)] hover:border-navy/30 transition-all duration-300">
                    <div className="w-11 h-11 bg-ice text-navy flex items-center justify-center mb-4"><Icon size={20} /></div>
                    <h3 className="font-serif text-[19px] text-midnight">{title}</h3>
                    <p className="text-slatesage text-[14px] leading-relaxed mt-2">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Openings */}
        <section id="openings" className="bg-white py-12 lg:py-16 border-t border-powder/60">
          <div className="container-x">
            <Reveal><h2 className="font-serif text-midnight font-semibold text-[34px] sm:text-[46px] mb-3">Current openings</h2></Reveal>
            <Reveal delay={80}><p className="text-slatesage text-[16px] mb-10 max-w-[560px]">{jobs.length} open positions. Click a role to see details and apply.</p></Reveal>
            <div className="space-y-4">
              {jobs.map((r, i) => (
                <Reveal key={r.slug} delay={i * 60}>
                  <Link to={`/careers/${r.slug}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-ice border border-powder/70 p-6 hover:border-navy/40 hover:bg-white transition-all duration-300" data-testid={`role-${i}`}>
                    <div>
                      <span className="eyebrow text-navy text-[11px]">{r.category}</span>
                      <h3 className="font-serif text-[23px] text-midnight mt-1 group-hover:text-navy transition-colors">{r.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-slatesage text-[13.5px]">
                        <span className="inline-flex items-center gap-1.5"><Briefcase size={14} /> {r.type}</span>
                        <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {r.location}</span>
                      </div>
                    </div>
                    <span className="btn-outline shrink-0 pointer-events-none">
                      <span>More Details</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-14 bg-ice border border-powder/70 p-8 text-center">
                <p className="text-midnight text-[17px] font-semibold">Don't see a perfect fit?</p>
                <p className="text-slatesage text-[15px] mt-2 mb-5">We still want to hear from you — tell us what you do best.</p>
                <button type="button" data-contact-trigger className="btn-amber" data-testid="careers-cta">
                  <span>Get in Touch</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
