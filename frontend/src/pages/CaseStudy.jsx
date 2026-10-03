import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { api, imgUrl, API } from "../lib/api";
import { slugify } from "../lib/slug";
import { usePageSeo } from "../lib/SeoContext";

const FALLBACK_ART = ["/images/cases/case-bi.webp", "/images/cases/case-crm.webp", "/images/cases/case-m365.webp"];

const paras = (text) => String(text || "").split(/\n+/).filter(Boolean);

const Block = ({ label, children, testId }) => (
  <Reveal className="mt-11" data-testid={testId}>
    <h2 className="font-serif font-semibold text-[22px] sm:text-[25px] leading-snug text-royal">{label}</h2>
    <div className="text-[#2e3745] text-[16.5px] leading-[1.8] space-y-5 mt-4">{children}</div>
  </Reveal>
);

export default function CaseStudy() {
  const { slug } = useParams();
  const [list, setList] = useState(null);

  useEffect(() => {
    api.get("/content/case-studies").then(({ data }) => setList(data || [])).catch(() => setList([]));
  }, []);

  const all = list || [];
  const cs = all.find((c) => slugify(c.title) === slug || c.id === slug || c.previous_titles?.some((title) => slugify(title) === slug));
  const others = all.filter((c) => c !== cs).slice(0, 3);
  const hero = cs?.image ? imgUrl(cs.image) : FALLBACK_ART[Math.max(all.indexOf(cs), 0) % 3];

  usePageSeo(cs ? {
    title: cs.seo_title || cs.title,
    description: cs.seo_description || cs.geo_summary || cs.summary || String(cs.body || "").slice(0, 180),
    keywords: cs.seo_keywords || cs.tag,
    image: cs.og_image ? imgUrl(cs.og_image) : `${API}/og/case-studies/${slugify(cs.title)}.png`,
    type: "article",
    robots: cs.seo_noindex ? "noindex, nofollow" : undefined,
    jsonLd: [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: cs.seo_title || cs.title,
      description: cs.seo_description || cs.geo_summary || cs.summary,
      image: (cs.og_image ? imgUrl(cs.og_image) : `${API}/og/case-studies/${slugify(cs.title)}.png`),
      author: { "@type": "Organization", name: "Intrinsic Technology" },
      publisher: { "@type": "Organization", name: "Intrinsic Technology" },
      articleSection: cs.tag || undefined,
    }],
  } : null);

  return (
    <div className="bg-white page-in" data-testid="case-study-page">
      <ScrollProgress />
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        {list && !cs ? (
          <section className="container-x py-24 text-center" data-testid="case-study-missing">
            <h1 className="font-serif font-semibold text-[32px] text-royal">This case study is not published yet.</h1>
            <Link to="/resources#case-studies" className="btn-amber mt-8 inline-flex"><span>Back to Resources</span><span className="btn-arrow"><ArrowRight size={14} /></span></Link>
          </section>
        ) : cs ? (
          <>
            {/* Header — category + title (Thrive-style) */}
            <section className="no-hero-fill pt-6 lg:pt-10" data-testid="case-study-header">
              <div className="mx-auto w-full max-w-[1000px] px-6 lg:px-10">
                <div className="flex flex-wrap items-center gap-2 text-[12px] font-sans">
                  <Link to="/resources" className="font-bold tracking-[0.14em] uppercase text-navy hover:text-royal transition-colors" data-testid="case-study-back">Case Studies</Link>
                  {cs.tag && <span className="text-slatesage">/ {cs.tag}</span>}
                </div>
                <Reveal>
                  <h1 className="font-serif font-semibold text-[34px] sm:text-[46px] leading-[1.07] text-royal mt-5" data-testid="case-study-title">{cs.title}</h1>
                </Reveal>
              </div>
            </section>

            {/* Hero image band */}
            <section className="mt-8 lg:mt-10" data-testid="case-study-hero">
              <div className="mx-auto w-full max-w-[1000px] px-6 lg:px-10">
                <Reveal>
                  <div className="w-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: cs.heroBg || "#eef2f8" }}>
                    <img src={hero} alt={cs.title} className="w-full h-auto object-contain" data-testid="case-study-image" />
                  </div>
                </Reveal>
              </div>
            </section>

            {/* Body */}
            <section className="mt-8 lg:mt-10 pb-4" data-testid="case-study-body">
              <div className="mx-auto w-full max-w-[1000px] px-6 lg:px-10">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-7 border-b border-powder/70">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center bg-navy text-white font-sans font-bold text-[11px] tracking-[0.12em] uppercase px-3 py-1.5" data-testid="case-study-tag">Case Study</span>
                    {cs.stat && <span className="font-sans font-bold text-[13px] tracking-[0.08em] uppercase text-midnight" data-testid="case-study-stat">{cs.stat}</span>}
                  </div>
                </div>

                <div className="mt-8" data-testid="case-study-intro">
                  {paras(cs.body).map((p, i) => (
                    <p key={i} className={i === 0 ? "font-serif text-royal text-[20px] sm:text-[23px] leading-[1.5] font-medium" : "text-[#2e3745] text-[16.5px] leading-[1.8] mt-5"}>{p}</p>
                  ))}
                </div>

                {cs.challenge && <Block label="The Challenge" testId="case-study-challenge">{paras(cs.challenge).map((p, i) => <p key={i}>{p}</p>)}</Block>}
                {cs.approach && <Block label="The Solution and Impact" testId="case-study-approach">{paras(cs.approach).map((p, i) => <p key={i}>{p}</p>)}</Block>}

                {(cs.results || []).length > 0 && (
                  <Reveal className="mt-11" data-testid="case-study-results">
                    <h2 className="font-serif font-semibold text-[22px] sm:text-[25px] leading-snug text-royal">Results</h2>
                    <ul className="mt-5 grid sm:grid-cols-2 gap-4">
                      {cs.results.map((r) => (
                        <li key={r} className="p-5 text-[#2e3745] text-[15.5px] leading-[1.65] border-l-2 border-[#f2a91c]" style={{ backgroundColor: "#f7f4ee" }}>{r}</li>
                      ))}
                    </ul>
                  </Reveal>
                )}

                {cs.quote && (
                  <Reveal className="mt-11" data-testid="case-study-quote">
                    <div className="border-l-[3px] border-[#f2a91c] pl-6">
                      <p className="font-serif italic text-royal text-[22px] sm:text-[24px] leading-[1.5]">“{cs.quote}”</p>
                      {cs.quote_author && <p className="text-midnight text-[14px] font-semibold mt-4">~ {cs.quote_author}</p>}
                    </div>
                  </Reveal>
                )}

                <Reveal className="mt-14 pt-10 border-t border-powder/70" data-testid="case-study-about">
                  <h2 className="font-serif font-semibold text-[21px] text-midnight">About Intrinsic</h2>
                  <p className="text-[#2e3745] text-[15px] leading-[1.75] mt-4" data-testid="case-study-about-copy">
                    {cs.about || `Intrinsic Technology Group provides managed IT services, cybersecurity, cloud services, infrastructure
                    management, endpoint protection, managed print, help desk services, and onsite IT support to small and
                    midsize organizations. Headquartered in New York City, Intrinsic works with businesses across healthcare,
                    financial services, legal, construction, nonprofit, and retail sectors through a coordinated technology
                    relationship that reduces the cost and complexity of working with multiple vendors. Intrinsic Technology
                    Group is a proud women-owned and minority-owned business.`}
                  </p>
                  {cs.contact_phone && (
                    <p className="text-[#2e3745] text-[15px] leading-[1.75] mt-4" data-testid="case-study-contact">
                      Contact us at <a href={`tel:${cs.contact_phone.replace(/[^+\d]/g, "")}`} className="text-navy underline underline-offset-4 hover:text-royal transition-colors" data-testid="case-study-phone">{cs.contact_phone}</a>
                      {cs.contact_linkedin && <> or follow us on <a href={cs.contact_linkedin} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-4 hover:text-royal transition-colors" data-testid="case-study-linkedin">@LinkedIn</a></>}.
                    </p>
                  )}
                </Reveal>

              </div>
            </section>

            {others.length > 0 && (
              <section className="py-12 lg:py-16 border-t border-powder/60" data-testid="case-study-more">
                <div className="container-x">
                  <p className="eyebrow text-[#c07f11] mb-8">More client results</p>
                  <div className="grid md:grid-cols-3 gap-6">
                    {others.map((o, i) => (
                      <Link key={o.id} to={`/case-studies/${slugify(o.title)}`} className="group border border-powder/70 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/30" data-testid={`case-study-more-${i}`}>
                        {o.stat && <p className="font-sans font-bold text-[12.5px] tracking-[0.1em] uppercase text-royal">{o.stat}</p>}
                        <h3 className="font-serif text-[20px] text-midnight mt-3 leading-snug group-hover:text-navy transition-colors">{o.title}</h3>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="container-x py-24" />
        )}
      </main>
      <Footer />
    </div>
  );
}
