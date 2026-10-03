import React from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./common";
import NetworkGraphic from "./NetworkGraphic";

const FinalCTA = () => {
  return (
    <section id="contact" className="relative overflow-hidden py-28 lg:py-36 hero-grain">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 120% at 20% 10%, #1a5fa8 0%, #0d4ea0 45%, #00388e 100%)",
        }}
      />
      <div className="absolute -bottom-20 right-10 w-[380px] h-[380px] rounded-full bg-amber/10 blur-3xl float-a" />
      <div className="absolute -top-16 left-0 w-[300px] h-[300px] rounded-full bg-white/5 blur-3xl float-b" />
      {/* Animated network graphic */}
      <div className="absolute inset-0 opacity-[0.14] pointer-events-none">
        <NetworkGraphic className="w-full h-full" color="#cfe0f7" accent="#faaf6a" />
      </div>

      <div className="container-x relative z-10 text-center">
        <Reveal>
          <h2 className="font-serif text-white font-semibold text-[32px] sm:text-[42px] leading-[1.06] max-w-[900px] mx-auto">
            Your Technology. Our Responsibility.
          </h2>
          <p className="text-white/80 text-[17px] leading-relaxed mt-7 max-w-[640px] mx-auto">
            Partner with a team that provides ongoing ownership and oversight across your technology
            environment—so your organization can operate with greater confidence.
          </p>
          <div className="flex items-center justify-center mt-10">
            <button type="button" data-assessment className="btn-amber" data-testid="finalcta-btn">
              <span>Talk to Our Team</span>
              <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FinalCTA;
