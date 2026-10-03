import React from "react";
import { Reveal } from "../common";
import { Eyebrow, H2, Body, C } from "./HomeUi";

const PARTNERS = [
  ["barracuda", "Barracuda"],
  ["sharp", "Sharp"],
  ["datto", "Datto"],
  ["scalepad", "ScalePad"],
  ["drata", "Drata"],
  ["auvik", "Auvik"],
  ["knowbe4", "KnowBe4"],
  ["connectwise", "ConnectWise"],
  ["aws", "AWS"],
  ["ubiquiti", "Ubiquiti"],
  ["watchguard", "WatchGuard"],
  ["meraki", "Cisco Meraki"],
  ["sentinelone", "SentinelOne"],
  ["apple", "Apple"],
  ["microsoft", "Microsoft"],
];

const HomePartners = () => (
  <section className="py-16 lg:py-24" style={{ background: "#f5f1e9" }} data-type-tone="light" data-testid="home-partners">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      <Reveal className="lg:col-span-5">
        <Eyebrow>Technology Ecosystem</Eyebrow>
        <H2 className="mt-5 max-w-[480px]">Technology Platforms We Manage and Support</H2>
        <Body className="mt-6 max-w-[430px]">
          Intrinsic works across the platforms that support your users, infrastructure, security, and day-to-day operations.
        </Body>
        <div className="mt-8 h-px w-full max-w-[430px]" style={{ background: C.rule }} />
        <p className="mt-5 font-sans text-[11px] font-bold tracking-[0.2em] uppercase sm:whitespace-nowrap" style={{ color: C.green }} data-testid="home-partners-note">
          One environment. Coordinated management.
        </p>
      </Reveal>

      <Reveal delay={120} className="lg:col-span-7">
        <div className="bg-white p-3 sm:p-5 lg:p-6" style={{ boxShadow: "0 30px 60px -40px rgba(15,61,148,0.35)" }}>
          <div className="pg-grid" data-testid="home-partners-grid">
            {PARTNERS.map(([slug, label], i) => (
              <div key={slug} className="pg-cell" tabIndex={0} aria-label={label} data-testid={`partner-${slug}`}>
                <img src={`/images/partners/${slug}.webp`} alt={`${label} logo`} className="pg-logo" loading="lazy" />
                <span className="pg-name" data-testid={`partner-name-${slug}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default HomePartners;
