import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../common";

export const SERVICES = [
  { slug: "threat-detection-response", title: "Threat Detection & Response", body: "Continuous monitoring, investigation, and response capabilities designed to identify security events, support timely action, and reduce business impact." },
  { slug: "identity-endpoint-security", title: "User, Identity & Endpoint Security", body: "Integrated security across users, identities, endpoints, email, and collaboration platforms, strengthening access management and protection across the modern workplace." },
  { slug: "network-perimeter-security", title: "Network & Perimeter Security", body: "Managed firewall environments, network security controls, remote access, and perimeter protections designed to support secure connectivity and operational reliability." },
  { slug: "security-assessments", title: "Security Assessments & Vulnerability Management", body: "Security assessments, vulnerability management, penetration testing, and remediation planning that help organizations identify risk, establish priorities, and make informed security decisions." },
  { slug: "security-monitoring-siem", title: "Security Monitoring & Analytics (SIEM)", body: "Centralized collection, analysis, and correlation of security information across endpoints, networks, cloud platforms, identity systems, and business applications." },
  { slug: "security-governance-compliance", title: "Security Governance & Compliance", body: "Governance, documentation, control oversight, and compliance support that help organizations maintain accountability and align security practices with applicable frameworks and regulatory requirements." },
];

const ServiceItem = ({ s, i }) => (
  <Reveal delay={(i % 3) * 90}>
    <Link to={`/services/${s.slug}`} className="group block py-8 pr-0 lg:pr-10 border-b border-powder last:border-b-0" data-testid={`cyber-service-${s.slug}`}>
      <span className="block font-mono text-[10px] font-bold tracking-[0.14em] text-sage mb-2.5 group-hover:text-amber transition-colors">{String(i + 1).padStart(2, "0")}</span>
      <h3 className="font-serif text-royal font-semibold text-[21px] lg:text-[25px] leading-[1.2] max-w-[22ch] mb-3 group-hover:text-navy transition-colors">{s.title}</h3>
      <p className="text-slatesage text-[14.5px] leading-[1.6] max-w-[40ch] mb-3.5">{s.body}</p>
      <span className="inline-flex items-center gap-2 text-amber text-[13px] font-bold tracking-wide">
        Learn More <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  </Reveal>
);

export const CyberServices = () => (
  <section id="cyber-services" className="bg-ice py-24 lg:py-32 overflow-hidden" data-testid="cyber-services">
    <div className="container-x">
      <div className="grid lg:grid-cols-[45fr_55fr] gap-6 lg:gap-16 items-end mb-14 lg:mb-[70px]">
        <Reveal>
          <p className="eyebrow eyebrow-line text-[#f2a91c] mb-5">Our Cybersecurity Services</p>
          <h2 className="font-serif text-royal font-semibold text-[32px] sm:text-[42px] leading-[1.14] max-w-[15ch]">Comprehensive Security Across Your Environment</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-[#4a5259] text-[16px] leading-[1.68] max-w-[45ch] pb-1">
            Intrinsic provides coordinated cybersecurity capabilities across the critical layers of the modern technology environment.
          </p>
        </Reveal>
      </div>

      <Reveal delay={80}>
        <div className="relative grid lg:grid-cols-2 lg:gap-x-[76px] bg-white shadow-[0_16px_44px_rgba(26,26,46,0.045)] px-7 sm:px-10 lg:pl-[68px] lg:pr-[58px] pt-8 lg:pt-[54px] pb-10 lg:pb-12">
          <span className="absolute left-0 top-0 bottom-0 w-[9px] bg-royal" />
          <span className="absolute right-0 top-0 h-[8px] w-[23%] bg-sage" />
          <div className="min-w-0">{SERVICES.slice(0, 3).map((s, i) => <ServiceItem key={s.slug} s={s} i={i} />)}</div>
          <div className="min-w-0 lg:pt-[38px]">{SERVICES.slice(3).map((s, i) => <ServiceItem key={s.slug} s={s} i={i + 3} />)}</div>
        </div>
      </Reveal>
    </div>
  </section>
);
