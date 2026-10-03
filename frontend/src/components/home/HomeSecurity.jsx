import React from "react";
import { Reveal } from "../common";
import { ImageMotion } from "../cyber/ImageMotion";
import { Eyebrow, H2, Dot, GoldButton, C } from "./HomeUi";

const TAGS = ["Threat Detection", "Vulnerability Management", "Security Monitoring", "Governance & Compliance"];

const HomeSecurity = () => (
  <section className="relative overflow-hidden py-12 lg:py-16" style={{ background: "#ecf0f7" }} data-testid="home-security">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow>Security by Design</Eyebrow>
        <H2 color={C.navy} className="mt-5 !text-[30px] sm:!text-[38px] lg:!text-[42px]">Security Isn't an Add‑On<Dot /><br />It's <span style={{ color: C.green }}>Intrinsic</span><Dot /></H2>
        <p className="text-[15.5px] leading-[1.72] mt-6" style={{ color: C.text }}>Security is foundational—not an additional service layered onto the technology environment.</p>
        <p className="text-[15.5px] leading-[1.72] mt-4" style={{ color: C.text }}>From identities and endpoints to cloud platforms, email, backups, and network infrastructure, security is integrated into how the environment is designed, managed, monitored, and improved.</p>
        <p className="mt-5 font-sans text-[12px] font-bold tracking-[0.14em] uppercase leading-[2]" style={{ color: C.green }} data-testid="home-security-tags">
          {TAGS.map((t, i) => <span key={t}>{t}{i < TAGS.length - 1 && <span className="mx-2" style={{ color: C.gold }}>·</span>}</span>)}
        </p>
        <p className="text-[15.5px] leading-[1.72] mt-5 font-medium" style={{ color: C.navy }}>One integrated security approach. One accountable technology partner.</p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6 flex justify-center lg:justify-end">
        <ImageMotion src="/images/home/security-weave.png" alt="Identity, endpoints, cloud and email, backup and network woven through one integrated security core" className="w-full max-w-[640px]" imgClassName="rounded-[18px]" w={927} h={601} testId="home-security-diagram" pulseR={15}
          pulses={[[461, 149], [460, 252], [461, 366], [460, 468]]}
          paths={[
            { d: "M461 55 L461 545", dur: 5, r: 6 },
            { d: "M55 107 L255 107", dur: 3, delay: 0 },
            { d: "M55 209 L255 209", dur: 3, delay: 0.5 },
            { d: "M55 312 L255 312", dur: 3, delay: 1.0 },
            { d: "M55 414 L255 414", dur: 3, delay: 1.5 },
            { d: "M55 516 L255 516", dur: 3, delay: 2.0 },
            { d: "M655 107 L865 107", dur: 3, delay: 1.2 },
            { d: "M655 209 L865 209", dur: 3, delay: 1.7 },
            { d: "M655 312 L865 312", dur: 3, delay: 2.2 },
            { d: "M655 414 L865 414", dur: 3, delay: 2.7 },
            { d: "M655 516 L865 516", dur: 3, delay: 3.2 },
          ]} />
      </Reveal>
    </div>
  </section>
);

export default HomeSecurity;
