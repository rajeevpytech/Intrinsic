import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Eyebrow, GoldButton, C } from "./HomeUi";
import HomeHeroMotion from "./HomeHeroMotion";

const DEFAULT = {
  hero_h1: "Managed IT, Cybersecurity, and Cloud Services",
  hero_h2: "Engineered, Monitored, and Secured for Business",
  hero_paragraph: "Intrinsic provides ongoing management across IT operations, cybersecurity, cloud, AI, and governance—bringing together the technical expertise, operational processes, and strategic oversight required to manage technology as a critical business function.",
  hero_cta: "Talk to an Expert",
};

const Headline = ({ text }) => {
  const clean = text.replace(/\.$/, "");
  const idx = clean.lastIndexOf("for Business");
  if (idx < 0) return <>{clean}<span style={{ color: C.gold }}>.</span></>;
  return <>{clean.slice(0, idx)}<span style={{ color: "#8fc0ff" }}>for Business</span><span style={{ color: C.gold }}>.</span></>;
};

const HomeHero = () => {
  const [site, setSite] = useState(DEFAULT);
  useEffect(() => { api.get("/content-site").then(({ data }) => setSite((s) => ({ ...s, ...data }))).catch(() => {}); }, []);
  return (
    <section className="relative overflow-hidden pt-[var(--nav-h)] text-white" style={{ background: "#00388e" }} data-testid="home-hero">
      <HomeHeroMotion />
      <img src="/images/home-hero-weave-navy.webp" alt="" aria-hidden="true" className="pointer-events-none absolute right-[-38%] top-[var(--nav-h)] h-[calc(100%-68px)] w-auto max-w-none opacity-40 md:hidden" />
      <div className="container-x relative z-10 py-16 lg:py-24 min-h-[520px] lg:min-h-[600px] flex items-center">
        <div className="max-w-[640px]">
          <Eyebrow light className="animate-fade-up">{site.hero_h1}</Eyebrow>
          <h1 className="font-serif font-medium text-[38px] sm:text-[50px] lg:text-[58px] leading-[1.08] tracking-[-0.01em] mt-6 animate-fade-up" style={{ animationDelay: "80ms" }} data-testid="home-hero-h1"><Headline text={site.hero_h2} /></h1>
          <p className="text-[16px] sm:text-[17px] leading-[1.7] text-white/90 mt-7 max-w-[560px] animate-fade-up" style={{ animationDelay: "180ms" }}>{site.hero_paragraph}</p>
          <div className="mt-9 animate-fade-up" style={{ animationDelay: "280ms" }}><GoldButton testId="home-hero-cta">{site.hero_cta}</GoldButton></div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
