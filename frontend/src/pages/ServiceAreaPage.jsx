import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { usePageSeo } from "../lib/SeoContext";

const AREAS = {
  "new-york": {
    slug: "new-york",
    title: "Managed IT Services in New York City",
    label: "New York IT Services",
    description: "On-site and remote managed IT, cybersecurity, and cloud services for New York City businesses, from our 14 Wall Street headquarters.",
    office: "14 Wall Street, Suite 5C, New York, NY 10005",
    intro: [
      "Intrinsic Technology is headquartered at 14 Wall Street in Lower Manhattan and provides on-site and remote managed IT, cybersecurity, and cloud services across the five boroughs and the greater New York City metro.",
      "Our local presence means fast on-site response in Manhattan and the surrounding area, combined with 24/7 remote monitoring and a responsive help desk for New York businesses in healthcare, financial services, legal, and nonprofit sectors.",
    ],
    coverage: ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island", "Westchester & NYC metro"],
    faqs: [
      { q: "Do you provide on-site IT support in New York City?", a: "Yes. From our 14 Wall Street headquarters we provide on-site support across Manhattan and the greater NYC metro, alongside 24/7 remote support." },
      { q: "Which New York industries do you serve?", a: "We support healthcare, financial services, legal and professional services, construction, and nonprofit organizations across New York City." },
    ],
  },
  "new-jersey": {
    slug: "new-jersey",
    title: "Managed IT Services in New Jersey",
    label: "New Jersey IT Services",
    description: "Managed IT, cybersecurity, and cloud services for New Jersey businesses, supported from our Paterson, NJ office.",
    office: "46–48 Camden Avenue, Paterson, NJ 07501",
    intro: [
      "From our office at 46–48 Camden Avenue in Paterson, Intrinsic Technology supports New Jersey businesses with managed IT, cybersecurity, and cloud services—on site where needed and remotely for day-to-day support.",
      "We serve organizations across northern New Jersey that want a responsive, security-focused technology partner close to home.",
    ],
    coverage: ["Paterson", "Newark", "Jersey City", "Bergen County", "Passaic County", "Northern NJ"],
    faqs: [
      { q: "Do you support businesses in New Jersey?", a: "Yes. From our Paterson, NJ office we support New Jersey organizations with on-site and remote managed IT, cybersecurity, and cloud services." },
      { q: "Can you provide on-site visits in NJ?", a: "Yes, on-site visits are available across northern New Jersey, complemented by remote monitoring and help desk support." },
    ],
  },
};

export default function ServiceAreaPage() {
  const { slug } = useParams();
  const area = AREAS[slug];

  usePageSeo(area ? {
    title: area.title,
    description: area.description,
    jsonLd: [{
      "@context": "https://schema.org", "@type": "Service", name: area.title, description: area.description,
      serviceType: "Managed IT Services", areaServed: area.label.replace(" IT Services", ""),
      provider: { "@type": "Organization", name: "Intrinsic Technology" },
    }, area.faqs.length ? {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: area.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    } : null].filter(Boolean),
  } : null);

  if (!area) return <Navigate to="/contact" replace />;

  return (
    <div className="bg-white page-in" data-testid="service-area-page">
      <ScrollProgress />
      <Navbar />
      <main>
        <section className="no-hero-fill relative overflow-hidden pt-[128px] pb-16" style={{ background: "#00388e" }}>
          <div className="container-x relative z-10 text-white">
            <p className="eyebrow text-[#f2a91c] mb-3">{area.label}</p>
            <h1 className="font-serif font-semibold text-[38px] sm:text-[52px] leading-[1.05] max-w-[860px]" data-testid="service-area-title">{area.title}</h1>
            <p className="inline-flex items-center gap-2 mt-6 text-white/85 text-[15px]"><MapPin size={16} /> {area.office}</p>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="container-x max-w-[880px]">
            {area.intro.map((p, i) => (
              <Reveal key={i}><p className={i === 0 ? "font-serif text-royal text-[20px] sm:text-[24px] leading-[1.5] font-medium" : "text-[#2e3745] text-[16.5px] leading-[1.8] mt-5"}>{p}</p></Reveal>
            ))}

            <h2 className="font-serif font-semibold text-[24px] text-royal mt-12">Areas we cover</h2>
            <ul className="mt-5 grid sm:grid-cols-2 gap-3">
              {area.coverage.map((c) => (
                <li key={c} className="flex items-center gap-3 text-slatesage text-[15.5px]"><span className="w-1.5 h-1.5 bg-amber rounded-full" />{c}</li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-amber"><span>Talk to an expert</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></Link>
              <a href="tel:+12126434808" className="btn-outline inline-flex items-center gap-2"><Phone size={15} /> 212.643.4808</a>
              <a href="mailto:consulting@intrinsicamerica.com" className="btn-outline inline-flex items-center gap-2"><Mail size={15} /> Email us</a>
            </div>
          </div>
        </section>

        {area.faqs.length > 0 && (
          <section className="py-16 bg-ice" data-testid="service-area-faqs">
            <div className="container-x max-w-[880px]">
              <h2 className="font-serif font-semibold text-[28px] sm:text-[34px] text-royal">Frequently asked questions</h2>
              <div className="mt-8 divide-y divide-powder/70 border-t border-powder/70">
                {area.faqs.map((f, i) => (
                  <div key={i} className="py-5">
                    <h3 className="font-serif text-[19px] text-midnight font-medium">{f.q}</h3>
                    <p className="text-slatesage text-[15.5px] leading-[1.75] mt-3">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
