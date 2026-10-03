import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "../common";

export const VERTICALS = [
  { slug: "financial-services", name: "Financial Services", color: "#1b61be", image: "https://images.unsplash.com/photo-1578999509166-2ba43795234d?auto=format&fit=crop&w=1400&q=80",
    body: "Financial services organizations operate within heightened security, governance, and regulatory requirements. Technology environments require strong controls, clear visibility, documented processes, and ongoing oversight." },
  { slug: "healthcare", name: "Healthcare", color: "#108474", image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1400&q=80",
    body: "Healthcare organizations depend on technology to support patient information, clinical operations, and business functions. Access, security, availability, and data protection must be managed within the requirements of HIPAA and the broader operating environment." },
  { slug: "non-profit", name: "Non-Profit", color: "#d4883a", image: "https://images.pexels.com/photos/7988663/pexels-photo-7988663.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    body: "Non-profit organizations require reliable, secure technology while balancing operational priorities, distributed teams, resource considerations, and the protection of donor, beneficiary, and organizational information." },
  { slug: "professional-services", name: "Professional Services", color: "#084c98", image: "https://images.unsplash.com/photo-1637665672552-9c9bf1974ff9?auto=format&fit=crop&w=1400&q=80",
    body: "Professional services organizations rely on technology to deliver client work, collaborate across teams, manage confidential information, and maintain consistent operations across offices and remote working environments." },
  { slug: "construction", name: "Construction", color: "#faaf6a", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
    body: "Construction organizations operate across offices, job sites, field teams, and project environments. Technology must provide reliable connectivity, secure access to business and project systems, and consistent support wherever work takes place." },
];

const Row = ({ v, i }) => (
  <Reveal delay={80}>
    <Link to={`/industries/${v.slug}`} className="group grid md:grid-cols-12 gap-6 md:gap-10 items-center py-10 lg:py-12 border-t border-powder" data-testid={`vertical-${v.slug}`}>
      <div className={`md:col-span-5 relative overflow-hidden h-[220px] md:h-[260px] ${i % 2 ? "md:order-last" : ""}`}>
        <img src={v.image} alt={v.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
        <span className="absolute inset-y-0 left-0 w-[6px]" style={{ backgroundColor: v.color }} />
        <span className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: v.color, opacity: 0.12 }} />
      </div>
      <div className="md:col-span-7">
        <span className="font-mono text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: v.color }}>Industry {String(i + 1).padStart(2, "0")}</span>
        <h3 className="font-serif text-royal font-semibold text-[26px] lg:text-[30px] leading-tight mt-3 group-hover:text-navy transition-colors">{v.name}</h3>
        <p className="text-[#4a5259] text-[15.5px] leading-[1.7] mt-4 max-w-[60ch]">{v.body}</p>
        <span className="inline-flex items-center gap-2 mt-6 text-[14px] font-bold text-royal border-b border-transparent group-hover:border-royal transition-[border-color]">
          Explore {v.name} <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  </Reveal>
);

export const VerticalsList = () => (
  <section className="bg-white py-24 lg:py-32" data-testid="verticals-list">
    <div className="container-x">
      <Reveal>
        <p className="eyebrow eyebrow-line text-[#f2a91c] mb-5">Industries We Serve</p>
        <h2 className="font-serif text-royal font-semibold text-[32px] sm:text-[42px] leading-[1.14] max-w-[22ch] mb-14">Industry Experience Across Complex Technology Environments</h2>
      </Reveal>
      <div className="border-b border-powder">{VERTICALS.map((v, i) => <Row key={v.slug} v={v} i={i} />)}</div>
    </div>
  </section>
);
