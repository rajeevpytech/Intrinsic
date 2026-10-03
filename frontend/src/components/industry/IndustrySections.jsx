import React from "react";
import { ArrowRight, Cloud, GitMerge, BarChart3, Workflow, HardDrive, ShieldCheck, Fingerprint, MailCheck, SearchCheck, Radar, Server, DatabaseBackup, ClipboardCheck } from "lucide-react";
import { Reveal } from "../common";

export const Eyebrow = ({ children, color = "text-[#f2a91c]" }) => <p className={`eyebrow eyebrow-line ${color} mb-5`}>{children}</p>;
export const H2 = ({ children, className = "text-royal" }) => <h2 className={`font-serif font-semibold text-[32px] sm:text-[42px] leading-[1.14] ${className}`}>{children}</h2>;
export const Paras = ({ items, className = "text-[#4a5259]" }) => (
  <div className={`space-y-5 text-[16px] leading-[1.72] ${className}`}>{items.map((p, i) => <p key={i}>{p}</p>)}</div>
);

/* Hero: split layout, image with colour wash + animated system tiles */
export const IndustryHero = ({ d }) => (
  <section className="relative bg-ice overflow-hidden pt-[var(--nav-h)]" data-testid="industry-hero">
    <span className="absolute left-0 top-[var(--nav-h)] bottom-0 w-[6px]" style={{ backgroundColor: d.color }} />
    <div className="container-x relative z-10 pt-20 lg:pt-[100px] pb-20 lg:pb-[100px] grid lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7 max-w-[680px]">
        <p className="cyber-eyebrow inline-flex items-center gap-4 animate-fade-up text-[#f2a91c]">{d.eyebrow} <span className="inline-block w-14 h-px bg-[#f2a91c]" /></p>
        <h1 className="cyber-h1 text-royal mt-7 animate-fade-up" style={{ animationDelay: "80ms" }}>{d.hero.title}</h1>
        <p className="text-[#4a5259] text-[17px] leading-[1.7] mt-7 animate-fade-up" style={{ animationDelay: "180ms" }}>{d.hero.body}</p>
        <div className="mt-9 animate-fade-up" style={{ animationDelay: "280ms" }}>
          <a href="#contact" className="btn-amber cyber-cta" data-testid="industry-hero-cta"><span>{d.hero.cta}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
        </div>
        {d.hero.tags && <p className="mt-10 font-mono text-[11px] font-bold tracking-[0.16em] uppercase text-slatesage animate-fade-up" style={{ animationDelay: "360ms" }} data-testid="industry-hero-tags">{d.hero.tags.join(" · ")}</p>}
      </div>
      <div className="lg:col-span-5 relative animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="relative h-[300px] lg:h-[440px] overflow-hidden">
          <img src={d.image} alt={d.name} className="w-full h-full object-cover hero-wipe" />
          <span className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: d.color, opacity: 0.35 }} />
          <span className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
        </div>
        <div className="absolute left-0 sm:-left-6 lg:-left-10 bottom-6 flex flex-col gap-2" data-testid="industry-hero-tiles">
          {d.environment.systems.slice(0, 4).map((s, i) => (
            <span key={s} className="ind-tile bg-white shadow-lg px-4 py-2 text-[12px] font-semibold tracking-wide text-royal flex items-center gap-2" style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />{s}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const TextSection = ({ s, bg = "bg-white", testId, aside }) => (
  <section className={`${s.bg || bg} py-24 lg:py-28`} data-testid={s.testId || testId}>
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-5"><Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.title}</H2>{aside}</Reveal>
      <Reveal delay={120} className="lg:col-span-7"><Paras items={s.paragraphs} /></Reveal>
    </div>
  </section>
);

export const SecurityBand = ({ s, color }) => (
  <section className="relative bg-royal text-white py-24 lg:py-28 overflow-hidden hero-grain" data-testid="industry-security">
    <div className="absolute -top-24 right-0 w-[460px] h-[460px] rounded-full blur-3xl float-a" style={{ backgroundColor: color, opacity: 0.18 }} />
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-5"><Eyebrow color="text-[#f2a91c]">{s.eyebrow}</Eyebrow><H2 className="text-white">{s.title}</H2>
        <div className="flex flex-wrap gap-2 mt-8">
          {s.chips.map((c, i) => (
            <span key={c} className="ind-chip inline-flex items-center gap-2 border border-white/25 px-3.5 py-2 text-[11.5px] font-bold tracking-[0.14em] uppercase text-white/90" style={{ animationDelay: `${i * 0.6}s` }} data-testid={`industry-chip-${i}`}>
              <ShieldCheck size={13} className="text-amber" />{c}
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7"><Paras items={s.paragraphs} className="text-white/85" /></Reveal>
    </div>
  </section>
);

const CARD_ICONS = [Cloud, GitMerge, BarChart3, Workflow];
export const CloudSection = ({ s }) => (
  <section className="bg-ice py-24 lg:py-28" data-testid="industry-cloud">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
        <Reveal className="lg:col-span-5"><Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.title}</H2></Reveal>
        <Reveal delay={120} className="lg:col-span-7"><Paras items={s.paragraphs} /></Reveal>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-powder">
        {s.cards.map((c, i) => { const Icon = CARD_ICONS[i % 4]; return (
          <Reveal key={c.title} delay={i * 80} className="bg-white">
            <div className="group h-full p-7 lg:p-8 relative overflow-hidden hover:bg-ice transition-colors duration-300" data-testid={`industry-card-${i}`}>
              <span className="absolute top-0 left-0 h-[3px] w-0 bg-amber transition-all duration-500 group-hover:w-full" />
              <span className="inline-flex w-11 h-11 items-center justify-center bg-royal/8 text-royal group-hover:bg-royal group-hover:text-white transition-colors duration-300"><Icon size={20} /></span>
              <h3 className="font-serif text-royal font-semibold text-[20px] leading-tight mt-6">{c.title}</h3>
              <p className="text-slatesage text-[14px] leading-[1.65] mt-3">{c.body}</p>
            </div>
          </Reveal>
        ); })}
      </div>
    </div>
  </section>
);

export const PlanningSection = ({ s, color }) => (
  <section className="bg-ice py-24 lg:py-28" data-testid="industry-planning">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-5"><Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.title}</H2>
        <ol className="mt-10 relative" data-testid="industry-steps">
          <span className="absolute left-[15px] top-4 bottom-4 w-px bg-powder draw-v" />
          <span className="absolute left-[15px] top-4 bottom-4 w-px overflow-hidden"><span className="gov-runner absolute left-0 w-full h-[60px] bg-gradient-to-b from-transparent to-amber" /></span>
          {s.steps.map((st, i) => (
            <li key={st} className="relative flex items-center gap-5 py-3">
              <span className="gov-dot relative z-10 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center font-mono text-[11px] font-bold text-royal" style={{ borderColor: color, animationDelay: `${i * 1.5}s` }}>{i + 1}</span>
              <span className="font-serif text-royal text-[19px] font-semibold">{st}</span>
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7"><Paras items={s.paragraphs} /></Reveal>
    </div>
  </section>
);

export const IndustryCTA = ({ s, color }) => (
  <section className="bg-white py-24 lg:py-32" data-testid="industry-cta">
    <div className="container-x">
      <Reveal>
        <div className="relative bg-ice border border-powder p-8 sm:p-12 lg:p-16 grid lg:grid-cols-12 gap-8 items-center overflow-hidden">
          <span className="absolute left-0 top-0 bottom-0 w-[9px]" style={{ backgroundColor: color }} />
          <div className="lg:col-span-8">
            <p className="eyebrow text-[#f2a91c] mb-4">{s.eyebrow}</p>
            <h2 className="font-serif text-royal font-semibold text-[30px] sm:text-[38px] leading-[1.14]">{s.title}</h2>
            <div className="mt-5 max-w-[62ch]"><Paras items={s.paragraphs} /></div>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <a href="#contact" className="btn-amber" data-testid="industry-cta-btn"><span>{s.button}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const CARD_ICONS_SEC = [Fingerprint, MailCheck, SearchCheck, Radar, Server, Cloud, DatabaseBackup, Fingerprint, ShieldCheck, SearchCheck, Radar, Server, ClipboardCheck];
export const CardsSection = ({ s, color }) => (
  <section className={`${s.bg || "bg-white"} py-24 lg:py-28`} data-testid={s.testId || "industry-cards"}>
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
        <Reveal className="lg:col-span-5"><Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.title}</H2></Reveal>
        <Reveal delay={120} className="lg:col-span-7"><Paras items={s.paragraphs} /></Reveal>
      </div>
      <div className={`grid sm:grid-cols-2 ${s.cards.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-px bg-powder`}>
        {s.cards.map((c, i) => { const Icon = CARD_ICONS_SEC[(s.iconOffset || 0) + i] || Server; return (
          <Reveal key={c.title} delay={i * 80} className="bg-white">
            <div className="group h-full p-7 lg:p-8 relative overflow-hidden hover:bg-ice transition-colors duration-300" data-testid={`${s.testId || "industry-cards"}-${i}`}>
              <span className="absolute top-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: color }} />
              <span className="inline-flex w-11 h-11 items-center justify-center bg-royal/8 text-royal group-hover:bg-royal group-hover:text-white transition-colors duration-300"><Icon size={20} /></span>
              <h3 className="font-serif text-royal font-semibold text-[20px] leading-tight mt-6">{c.title}</h3>
              <p className="text-slatesage text-[14px] leading-[1.65] mt-3">{c.body}</p>
            </div>
          </Reveal>
        ); })}
      </div>
      {s.closing && <Reveal delay={200}><p className="font-serif text-royal text-[20px] leading-snug border-l-[3px] pl-5 mt-12 max-w-[70ch]" style={{ borderColor: color }}>{s.closing}</p></Reveal>}
    </div>
  </section>
);

export const ContinuityAside = () => (
  <div className="mt-8 inline-flex items-center gap-3 bg-ice border border-powder px-4 py-3 text-[13px] text-royal font-semibold"><HardDrive size={16} className="text-amber" /> Secure cloud + recovery included in Managed IT</div>
);
