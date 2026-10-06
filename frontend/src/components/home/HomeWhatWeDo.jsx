import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../common";
import { Eyebrow, H2, Dot, TextLink, Body, C } from "./HomeUi";

const AREAS = [
  { t: "Managed IT & Help Desk", to: "/services/managed-it", d: "Comprehensive management of users, endpoints, infrastructure, Microsoft 365, networks, support, and day-to-day technology operations." },
  { t: "Cybersecurity", to: "/services/cybersecurity", d: "Integrated protection, monitoring, and risk management across identities, endpoints, networks, cloud platforms, applications, and data." },
  { t: "Cloud", to: "/services/cloud", d: "Cloud strategy, infrastructure, migration, backup, disaster recovery, and ongoing management designed around security, performance, and resilience." },
  { t: "AI & Automation", to: "/services/ai", d: "Practical AI and automation capabilities—from Microsoft Copilot and workflow automation to data readiness, secure adoption, and ongoing management." },
  { t: "Governance & Compliance", to: "/services/security-governance-compliance", d: "Policies, controls, documentation, evidence, and oversight that connect technology operations with security, regulatory, and organizational requirements." },
  { t: "vCIO & Consulting", to: "/services/co-managed-it", d: "Strategic technology leadership supporting roadmaps, budgeting, lifecycle planning, major initiatives, modernization, and technology transitions." },
];

const AreaCard = ({ a, i }) => (
  <motion.div whileHover="hover" initial="rest" animate="rest" className="h-full">
    <Link to={a.to} className="group relative block h-full py-7 pr-6 pl-4 -ml-4 rounded-[4px] transition-colors duration-300 hover:bg-[#f3f7fd]" data-testid={`home-area-${i}`}>
      <motion.span variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="absolute left-0 top-7 bottom-7 w-[3px] origin-top rounded-full" style={{ background: C.gold }} />
      <motion.h3 variants={{ rest: { x: 0 }, hover: { x: 6 } }} transition={{ duration: 0.3 }} className="flex items-center gap-2 font-sans font-bold text-[13px] tracking-[0.12em] uppercase" style={{ color: C.royal }}>
        {a.t}
        <motion.span variants={{ rest: { opacity: 0, x: -6 }, hover: { opacity: 1, x: 0 } }} transition={{ duration: 0.3 }} className="inline-flex" style={{ color: C.gold }}><ArrowRight size={14} strokeWidth={2.5} /></motion.span>
      </motion.h3>
      <motion.div variants={{ rest: { x: 0 }, hover: { x: 6 } }} transition={{ duration: 0.3, delay: 0.03 }}><Body className="mt-4 text-[14.5px]">{a.d}</Body></motion.div>
    </Link>
  </motion.div>
);

const HomeWhatWeDo = () => (
  <section id="services" className="bg-white py-12 lg:py-16" data-testid="home-what-we-do">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <Reveal className="lg:col-span-8">
          <Eyebrow>What We Do</Eyebrow>
          <H2 className="mt-5">One Environment<Dot /><br />Coordinated Management<Dot color={C.green} /></H2>
          <Body className="mt-6 max-w-[680px]">Intrinsic brings together six areas of technology management within one coordinated environment—providing the operational expertise, security oversight, infrastructure management, governance, and strategic guidance organizations require.</Body>
          <p className="mt-5 font-sans font-semibold text-[15.5px]" style={{ color: C.royal }}>Six areas. One team. Complete accountability<Dot color={C.green} /></p>
        </Reveal>
      </div>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3" data-testid="home-areas">
        {AREAS.map((a, i) => (
          <Reveal key={a.t} delay={i * 70} className={`border-[#d5deea] ${i % 2 !== 0 ? "sm:pl-8 sm:border-l" : ""} ${i >= 2 ? "sm:border-t" : ""} ${i % 3 !== 0 ? "lg:pl-8 lg:border-l" : "lg:pl-0 lg:border-l-0"} ${i >= 3 ? "lg:border-t" : "lg:border-t-0"}`}>
            <AreaCard a={a} i={i} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default HomeWhatWeDo;
