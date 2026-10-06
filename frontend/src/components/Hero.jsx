import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { api } from "../lib/api";
import HeroVisual from "./HeroVisual";

const HERO_DEFAULT = {
  hero_h1: "Managed IT, Cybersecurity, and Cloud Services",
  hero_h2: "Engineered, Monitored, and Secured for Business",
  hero_paragraph:
    "Intrinsic provides complete oversight of your technology environment, combining proactive monitoring, infrastructure management, and strategic guidance to keep your operations secure and resilient.",
  hero_cta: "Talk to an Expert",
};

const Hero = () => {
  const [site, setSite] = useState(HERO_DEFAULT);
  useEffect(() => {
    api.get("/content-site").then(({ data }) => setSite((s) => ({ ...s, ...data }))).catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden pt-[var(--nav-h)]">
      {/* Vibrant royal-blue gradient (LightYears palette), shading from deep royal blue to lighter blue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, #0c3f96 0%, #1655bb 35%, #2f7ad6 70%, #5aa0ec 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 100% 50%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 55%)",
        }}
      />

      <div className="container-x relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center min-h-[520px] lg:min-h-[600px] pt-16 pb-16">
          {/* Left copy */}
          <div className="lg:col-span-7 py-8 relative">
            <h1 className="font-serif font-semibold leading-[1.08] text-[34px] sm:text-[42px] lg:text-[46px] animate-fade-up">
              {site.hero_h1}
            </h1>
            <h2
              className="font-serif text-white/90 font-normal mt-6 text-[22px] sm:text-[28px] lg:text-[32px] leading-snug animate-fade-up"
              style={{ animationDelay: "120ms" }}
            >
              {site.hero_h2}
            </h2>
            <div className="mt-9 animate-fade-up" style={{ animationDelay: "240ms" }}>
              <a href="#contact" className="btn-amber" data-testid="hero-cta">
                <span>{site.hero_cta}</span>
                <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
              </a>
            </div>
          </div>

          {/* Right animated services visual */}
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center animate-fade-up" style={{ animationDelay: "360ms" }}>
            <HeroVisual />
          </div>
        </div>

        {/* scroll cue */}
        <div className="hidden lg:flex justify-center pb-6">
          <a href="#services" aria-label="Scroll to services" className="scroll-cue text-white/70 hover:text-amber transition-colors">
            <ChevronDown size={26} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
