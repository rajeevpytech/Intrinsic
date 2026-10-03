import React from "react";
import { Reveal } from "../common";
import { GoldButton, Dot, C } from "./HomeUi";

const HomeCta = () => (
  <section id="contact" className="relative overflow-hidden py-12 lg:py-16 text-white" style={{ background: "#00388e" }} data-testid="home-cta">
    <svg className="absolute right-0 top-0 h-full w-[45%] pointer-events-none" viewBox="0 0 600 300" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <circle cx="560" cy="150" r="210" fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1.2" />
      <circle cx="560" cy="150" r="300" fill="none" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1.2" className="pm-breathe" />
      <circle cx="560" cy="150" r="130" fill="none" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
      <g><animateTransform attributeName="transform" type="rotate" from="0 560 150" to="360 560 150" dur="36s" repeatCount="indefinite" /><circle cx="350" cy="150" r="6" fill={C.gold} /></g>
      <g><animateTransform attributeName="transform" type="rotate" from="120 560 150" to="480 560 150" dur="48s" repeatCount="indefinite" /><circle cx="260" cy="150" r="5" fill="#7fd1c4" /></g>
      <g><animateTransform attributeName="transform" type="rotate" from="240 560 150" to="600 560 150" dur="60s" repeatCount="indefinite" /><circle cx="430" cy="150" r="4" fill="#9fcdb9" /></g>
    </svg>
    <div className="container-x relative grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <Reveal className="lg:col-span-4">
        <h2 className="font-serif font-medium text-[34px] sm:text-[40px] leading-[1.15]">Your Technology<Dot /><br />Our Responsibility<Dot color="#8fc0ff" /></h2>
      </Reveal>
      <Reveal delay={100} className="lg:col-span-5 lg:border-l lg:border-white/25 lg:pl-10">
        <p className="text-[15px] leading-[1.7] text-white/90">Partner with a team that provides ongoing ownership and oversight across your technology environment—so your organization can operate with greater confidence.</p>
      </Reveal>
      <Reveal delay={160} className="lg:col-span-3 lg:flex lg:justify-end"><GoldButton to="/contact#contact-form-section" testId="home-cta-btn">Talk to Our Team</GoldButton></Reveal>
    </div>
  </section>
);

export default HomeCta;
