import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Server, Cloud, ShieldCheck, DatabaseBackup, Gauge, LayoutGrid, Activity, Fingerprint, Radar, FileCheck2, RefreshCw, Workflow, BookOpen, Sparkles, Lock, Users, Scale } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { Eyebrow, H2, Paras, SecurityBand, CardsSection } from "../components/industry/IndustrySections";
import { Ticker, CardGrid, CycleSection, SplitText } from "../components/shared/PageBlocks";

export const ICONS = { Server, Cloud, ShieldCheck, DatabaseBackup, Gauge, LayoutGrid, Activity, Fingerprint, Radar, FileCheck2, RefreshCw, Workflow, BookOpen, Sparkles, Lock, Users, Scale };

const Cta = ({ label, assessment, testId }) => assessment
  ? <button type="button" data-assessment className="btn-amber cyber-cta" data-testid={testId}><span>{label}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></button>
  : <a href="#contact" className="btn-amber cyber-cta" data-testid={testId}><span>{label}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>;

const Hero = ({ h, graphic, id }) => {
  const dark = h.theme === "dark";
  const bg = dark ? "text-white hero-grain" : h.theme === "sage" ? "cyber-hero-bg" : "bg-ice";
  return (
    <section className={`relative overflow-hidden pt-[var(--nav-h)] ${bg}`} data-testid={`${id}-hero`}>
      {dark && <div className="absolute inset-0" style={{ background: "#00388e" }} />}
      {!dark && <span className="absolute left-0 top-[var(--nav-h)] bottom-0 w-[6px] bg-royal" />}
      <div className="container-x relative z-10 pt-20 lg:pt-[100px] pb-20 lg:pb-[100px] grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 max-w-[640px]">
          <p className={`cyber-eyebrow inline-flex items-center gap-4 animate-fade-up ${dark ? "text-white/90" : "text-[#f2a91c]"}`}>{h.eyebrow} <span className="inline-block w-14 h-px bg-[#f2a91c]" /></p>
          <h1 className={`cyber-h1 mt-7 animate-fade-up ${dark ? "text-white" : "text-royal"}`} style={{ animationDelay: "80ms" }}>{h.title}</h1>
          {h.lead && <p className={`cyber-p mt-7 animate-fade-up ${dark ? "text-white/90" : "text-royal/90"}`} style={{ animationDelay: "160ms" }}>{h.lead}</p>}
          {h.body && <p className={`text-[16px] leading-[1.7] mt-5 animate-fade-up ${dark ? "text-white/75" : "text-[#4a5259]"}`} style={{ animationDelay: "220ms" }}>{h.body}</p>}
          <div className="mt-9 animate-fade-up" style={{ animationDelay: "300ms" }}><Cta label={h.cta} assessment={h.assessment} testId={`${id}-hero-cta`} /></div>
        </div>
        <div className="lg:col-span-6 animate-fade-in" style={{ animationDelay: "200ms" }}>{graphic}</div>
      </div>
    </section>
  );
};

const LinkList = ({ s, id }) => (
  <section className="bg-white py-12 lg:py-16" data-testid={s.testId || `${id}-list`}>
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-12">
        <Reveal className="lg:col-span-5"><Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.title}</H2></Reveal>
        {s.paragraphs && <Reveal delay={120} className="lg:col-span-7"><Paras items={s.paragraphs} /></Reveal>}
      </div>
      <div className="border-t border-powder">
        {s.items.map((it, i) => {
          const Icon = ICONS[it.icon] || Server;
          const inner = (<>
            <span className="md:col-span-1 font-mono text-[11px] text-slatesage pt-1">0{i + 1}</span>
            <div className="md:col-span-4 flex items-start gap-4"><span className="inline-flex w-11 h-11 shrink-0 items-center justify-center bg-royal/8 text-royal group-hover:bg-royal group-hover:text-white transition-colors"><Icon size={20} /></span><h3 className="font-serif text-royal font-semibold text-[23px] leading-tight">{it.title}</h3></div>
            <p className="md:col-span-5 text-[#4a5259] text-[15px] leading-[1.7]">{it.body}</p>
            <span className="md:col-span-2 md:justify-self-end inline-flex items-center gap-2 text-[13.5px] font-bold text-royal whitespace-nowrap">{it.to ? <>{it.linkLabel || "Explore"} <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" /></> : null}</span>
          </>);
          const cls = "group grid md:grid-cols-12 gap-4 md:gap-8 items-start py-8 border-b border-powder px-2 -mx-2 transition-colors";
          return it.to
            ? <Reveal key={it.title} delay={60}><Link to={it.to} className={`${cls} hover:bg-ice/60`} data-testid={`${id}-item-${i}`}>{inner}</Link></Reveal>
            : <Reveal key={it.title} delay={60}><div className={cls} data-testid={`${id}-item-${i}`}>{inner}</div></Reveal>;
        })}
      </div>
    </div>
  </section>
);

const Facets = ({ s, id }) => (
  <section className={`${s.bg || "bg-ice"} py-12 lg:py-16`} data-testid={s.testId || `${id}-facets`}>
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-5"><Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.title}</H2>{s.paragraphs && <Paras items={s.paragraphs} className="text-[#4a5259] mt-6" />}</Reveal>
      <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {s.items.map((it, i) => (
          <Reveal key={it.title} delay={i * 70}>
            <div className="border-t-2 border-royal/20 pt-4 group hover:border-amber transition-colors" data-testid={`${id}-facet-${i}`}>
              <h3 className="font-serif text-royal font-semibold text-[20px]">{it.title}</h3>
              <p className="text-slatesage text-[14.5px] leading-[1.65] mt-2">{it.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const CtaCard = ({ s, id }) => (
  <section className="bg-white py-12 lg:py-16 lg:py-32" data-testid={`${id}-cta`}>
    <div className="container-x"><Reveal>
      <div className="relative bg-ice border border-powder p-8 sm:p-12 lg:p-16 grid lg:grid-cols-12 gap-8 items-center overflow-hidden">
        <span className="absolute left-0 top-0 bottom-0 w-[9px] bg-royal" />
        <div className="lg:col-span-8">
          {s.eyebrow && <p className="eyebrow text-[#f2a91c] mb-4">{s.eyebrow}</p>}
          <h2 className="font-serif text-royal font-semibold text-[30px] sm:text-[38px] leading-[1.14]">{s.title}</h2>
          <div className="mt-5 max-w-[62ch]"><Paras items={s.paragraphs} /></div>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end"><Cta label={s.cta} assessment={s.assessment} testId={`${id}-cta-btn`} /></div>
      </div>
    </Reveal></div>
  </section>
);

export default function ServicePage({ d, graphic }) {
  const id = d.id;
  return (
    <div className="bg-white page-in" data-testid={`${id}-page`}>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero h={d.hero} graphic={graphic} id={id} />
        {d.sections.map((s, i) => {
          const key = `${s.type}-${i}`;
          switch (s.type) {
            case "text": return <SplitText key={key} {...s} testId={s.testId || `${id}-${i}`} />;
            case "cards": return <CardGrid key={key} eyebrow={s.eyebrow} title={s.title} cards={s.cards.map((c) => ({ ...c, Icon: ICONS[c.icon] || Server }))} testId={s.testId || `${id}-cards-${i}`} cols={s.cols || "lg:grid-cols-3"} />;
            case "cardsIntro": return <CardsSection key={key} s={{ ...s, testId: s.testId || `${id}-cards-${i}` }} color="#00388e" />;
            case "band": return <SecurityBand key={key} s={s} color="#1b61be" />;
            case "cycle": return <CycleSection key={key} {...s} testId={s.testId || `${id}-cycle`} />;
            case "ticker": return <Ticker key={key} items={s.items} testId={`${id}-ticker`} />;
            case "list": return <LinkList key={key} s={s} id={id} />;
            case "facets": return <Facets key={key} s={s} id={id} />;
            case "cta": return <CtaCard key={key} s={s} id={id} />;
            default: return null;
          }
        })}
      </main>
      <Footer />
    </div>
  );
}
