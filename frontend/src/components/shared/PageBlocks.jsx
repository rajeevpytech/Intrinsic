import React from "react";
import { Reveal } from "../common";
import { Eyebrow, H2, Paras } from "../industry/IndustrySections";
import { CycleGraphic } from "../networking/NetworkGraphics";

export const Ticker = ({ items, testId = "ticker" }) => (
  <div className="border-y border-powder bg-white overflow-hidden py-4" data-testid={testId}>
    <div className="ticker-track flex gap-10 whitespace-nowrap">
      {[...items, ...items, ...items].map((t, i) => (
        <span key={i} className="inline-flex items-center gap-10 font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-royal">{t}<span className="w-1.5 h-1.5 rounded-full bg-amber" /></span>
      ))}
    </div>
  </div>
);

export const CardGrid = ({ eyebrow, title, cards, testId = "cards", cols = "lg:grid-cols-3" }) => (
  <section className="bg-ice py-24 lg:py-28" data-testid={testId}>
    <div className="container-x">
      <Reveal><Eyebrow>{eyebrow}</Eyebrow><H2>{title}</H2></Reveal>
      <div className={`grid sm:grid-cols-2 ${cols} gap-px bg-powder mt-12`}>
        {cards.map(({ Icon, title: t, body }, i) => (
          <Reveal key={t} delay={i * 70} className="bg-white">
            <div className="group h-full p-7 lg:p-9 relative overflow-hidden hover:bg-ice transition-colors duration-300" data-testid={`${testId}-${i}`}>
              <span className="absolute top-0 left-0 h-[3px] w-0 bg-amber transition-all duration-500 group-hover:w-full" />
              <div className="flex items-center justify-between"><span className="inline-flex w-11 h-11 items-center justify-center bg-royal/8 text-royal group-hover:bg-royal group-hover:text-white transition-colors duration-300"><Icon size={20} /></span><span className="font-mono text-[11px] text-slatesage">0{i + 1}</span></div>
              <h3 className="font-serif text-royal font-semibold text-[21px] leading-tight mt-6">{t}</h3>
              <p className="text-slatesage text-[14.5px] leading-[1.65] mt-3">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export const CycleSection = ({ eyebrow, title, intro, steps, testId = "cycle" }) => (
  <section className="bg-ice py-24 lg:py-28" data-testid={`${testId}-section`}>
    <div className="container-x grid lg:grid-cols-12 gap-12 items-center">
      <Reveal className="lg:col-span-5">
        <Eyebrow>{eyebrow}</Eyebrow><H2>{title}</H2>
        <Paras items={intro} className="text-[#4a5259] mt-6" />
        <div className="mt-10"><CycleGraphic steps={steps.map((c) => c.step)} /></div>
      </Reveal>
      <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
        {steps.map((c, i) => (
          <Reveal key={c.step} delay={i * 90}>
            <div className="bg-white border border-powder p-7 h-full relative overflow-hidden group hover:border-royal/40 transition-colors" data-testid={`${testId}-step-${i}`}>
              <span className="font-mono text-[12px] font-bold text-amber">0{i + 1} —</span>
              <h3 className="font-serif text-royal font-semibold text-[22px] mt-2 uppercase tracking-wide">{c.step}</h3>
              <p className="text-slatesage text-[14.5px] leading-[1.65] mt-3">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export const SplitText = ({ eyebrow, title, paragraphs, bg = "bg-white", testId, dark = false }) => (
  <section className={`relative ${dark ? "bg-royal text-white hero-grain" : bg} py-24 lg:py-28 overflow-hidden`} data-testid={testId}>
    {dark && <div className="absolute -bottom-24 left-0 w-[420px] h-[420px] rounded-full bg-royal/40 blur-3xl float-a" />}
    <div className="container-x relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-16">
      <Reveal className="lg:col-span-5"><Eyebrow color={dark ? "text-white/90" : "text-[#f2a91c]"}>{eyebrow}</Eyebrow><H2 className={dark ? "text-white" : "text-royal"}>{title}</H2></Reveal>
      <Reveal delay={120} className="lg:col-span-7"><Paras items={paragraphs} className={dark ? "text-white/85" : "text-[#4a5259]"} /></Reveal>
    </div>
  </section>
);
