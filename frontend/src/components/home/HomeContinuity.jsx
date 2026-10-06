import React from "react";
import { Reveal } from "../common";
import { Eyebrow, H2, Dot, Body, C } from "./HomeUi";
import { VennMotion } from "./HomeOverlays";

const PILLARS = [
  { t: "Continuity", d: "Knowledge of the environment built through ongoing involvement." },
  { t: "Expertise", d: "Specialized technical resources available as requirements change." },
  { t: "Accountability", d: "Clear responsibility for issues, priorities, and the broader environment." },
];

const HomeContinuity = () => (
  <section className="py-12 lg:py-16" style={{ background: C.sage }} data-testid="home-continuity">
    <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
      <Reveal className="lg:col-span-6">
        <Eyebrow>The People Responsible for Your Technology</Eyebrow>
        <H2 className="mt-5">Technology Management<br />Built on Continuity<Dot /></H2>
        <Body className="mt-6" color="#2e3745">Behind every secure, well-managed technology environment is a team that understands how it operates.</Body>
        <Body className="mt-4" color="#2e3745">At Intrinsic, clients work with dedicated professionals who develop an understanding of their business, technology environment, and priorities. That continuity creates stronger operational knowledge, clearer accountability, and more informed technology management over time.</Body>
        <ul className="mt-7 grid sm:grid-cols-3 gap-5" data-testid="home-pillars">
          {PILLARS.map((p, i) => (
            <li key={p.t} className="border-t-2 pt-3" style={{ borderColor: i === 1 ? C.gold : C.royal }}>
              <p className="font-serif font-semibold text-[17px]" style={{ color: C.deep }}>{p.t}</p>
              <p className="text-[13px] leading-[1.6] mt-1.5" style={{ color: "#2e3745" }}>{p.d}</p>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-6"><VennMotion className="lg:scale-[1.06]" /></Reveal>
    </div>
  </section>
);

export default HomeContinuity;
