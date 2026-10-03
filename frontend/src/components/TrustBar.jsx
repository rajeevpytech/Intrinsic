import React from "react";
import { Reveal } from "./common";

const clients = [
  "NORTHBRIDGE", "MERIDIAN", "CLEARWATER", "VANTAGE", "SUMMIT CO", "HARBORLINE", "ASHFORD", "KESTREL",
];

const Marks = () => (
  <div className="marquee-track">
    {[...clients, ...clients].map((c, i) => (
      <span
        key={`${c}-${i}`}
        className="font-serif text-[22px] sm:text-[26px] tracking-tight text-powder hover:text-navy transition-colors duration-300 select-none px-9 whitespace-nowrap"
      >
        {c}
      </span>
    ))}
  </div>
);

const TrustBar = () => {
  return (
    <section className="bg-white border-b border-powder/60 py-11">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-slatesage text-center text-[11px] mb-8">
            Trusted by organizations that can't afford downtime
          </p>
        </Reveal>
      </div>
      <div className="marquee-mask">
        <Marks />
      </div>
    </section>
  );
};

export default TrustBar;
