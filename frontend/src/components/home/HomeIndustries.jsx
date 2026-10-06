import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Landmark, Activity, HeartHandshake, Users, HardHat } from "lucide-react";
import { Reveal } from "../common";
import { Eyebrow, H2, Dot, TextLink, Body, C } from "./HomeUi";

const INDUSTRIES = [
  { Icon: Landmark, l: "Financial Services", to: "/industries/financial-services", d: "Security, information protection, regulatory requirements, and operational resilience." },
  { Icon: Activity, l: "Healthcare", to: "/industries/healthcare", d: "Reliable technology, patient information protection, security controls, and HIPAA requirements." },
  { Icon: HeartHandshake, l: "Non-Profit", to: "/industries/non-profit", d: "Technology that supports programs, people, information protection, and organizational priorities." },
  { Icon: Users, l: "Professional Services", to: "/industries/professional-services", d: "Secure, reliable technology supporting client delivery, collaboration, and distributed operations." },
  { Icon: HardHat, l: "Construction", to: "/industries/construction", d: "Connected offices, project sites, field teams, devices, cloud platforms, and business systems." },
];

const HomeIndustries = () => (
  <section className="bg-white py-12 lg:py-16" data-testid="home-industries">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <Reveal className="lg:col-span-8">
          <Eyebrow>Industries</Eyebrow>
          <H2 className="mt-5">Technology Management<br />Informed by Industry Context<Dot /></H2>
          <Body className="mt-6 max-w-[720px]">Every organization operates within a different combination of business requirements, information responsibilities, security risks, and regulatory considerations.</Body>
          <Body className="mt-4 max-w-[720px]">Intrinsic combines industry experience with technology expertise to manage environments around the way each organization operates.</Body>
        </Reveal>
        <Reveal delay={100} className="lg:col-span-4 lg:pt-3 lg:flex lg:justify-end"><TextLink to="/industries" testId="home-explore-industries">Explore Industries</TextLink></Reveal>
      </div>
      <div className="mt-14 relative" data-testid="home-industry-track">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10">
          {INDUSTRIES.map(({ Icon, l, to, d }, i) => (
            <Reveal key={l} delay={i * 90}>
              <Link to={to} className="group flex flex-col items-center text-center px-3" data-testid={`home-industry-${i}`}>
                <motion.span whileHover={{ y: -4, scale: 1.08 }} className="inline-flex transition-colors group-hover:text-[#f2a91c]" style={{ color: C.royal }}><Icon size={44} strokeWidth={1.4} /></motion.span>
                <span className="mt-4 font-sans font-semibold text-[14px] leading-[1.35] whitespace-nowrap" style={{ color: C.deep }}>{l}</span>
                <span className="mt-2 text-[12.5px] leading-[1.55]" style={{ color: "#4a5568" }}>{d}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="hidden lg:block relative mt-10 h-6">
          <motion.span className="absolute left-0 right-0 top-1/2 h-[2px] origin-left" style={{ background: C.royal }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
          <div className="absolute inset-0 grid grid-cols-5">
            {INDUSTRIES.map((x, i) => (
              <div key={x.l} className="flex justify-center items-center">
                <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 260 }} className={`block rounded-full ${i % 2 ? "w-[18px] h-[18px]" : "w-[16px] h-[16px] bg-white border-[3px]"}`} style={i % 2 ? { background: C.gold, boxShadow: "0 0 0 4px rgba(242,169,28,0.25)" } : { borderColor: C.royal }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HomeIndustries;
