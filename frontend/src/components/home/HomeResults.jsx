import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "../common";
import { Eyebrow, H2, TextLink, C } from "./HomeUi";
import { api, imgUrl } from "../../lib/api";
import { slugify } from "../../lib/slug";

const FALLBACK = [
  { stat: "40+ Hours Saved Monthly", tag: "Nonprofit · Business Intelligence", title: "Turning Data into Actionable Insights", summary: "Interactive reporting replaced manual spreadsheets across multiple locations and reduced licensing costs by an estimated 40%." },
  { stat: "95% Adoption in 30 Days", tag: "Professional Services · CRM & SSO", title: "Centralizing Relationships, Eliminating Friction", summary: "Salesforce Sales Cloud was integrated with the firm's Microsoft environment, including single sign-on and automatic activity capture." },
  { stat: "Zero Downtime", tag: "Communications · Microsoft 365", title: "One Brand, One Identity, Zero Downtime", summary: "Four email domains and more than 50 SharePoint sites were consolidated into one Microsoft 365 identity with zero downtime." },
];

const ART = ["/images/cases/case-bi.webp", "/images/cases/case-crm.webp", "/images/cases/case-m365.webp"];
const TINT = ["#eef2f8", "#f7f1e4", "#edf1ee"];

const excerpt = (t = "", n = 180) => (t.length > n ? `${t.slice(0, t.lastIndexOf(" ", n))}…` : t);

const HomeResults = () => {
  const [cases, setCases] = useState(FALLBACK);

  useEffect(() => {
    api.get("/content/case-studies").then(({ data }) => { if (data?.length) setCases(data.slice(0, 3)); }).catch(() => {});
  }, []);

  return (
    <section className="bg-white py-14 lg:py-20" data-testid="home-results">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          <Reveal className="lg:col-span-8">
            <Eyebrow>Case Studies</Eyebrow>
            <H2 className="mt-5">Technology Work Measured by Business Outcomes</H2>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-4 lg:flex lg:justify-end lg:pb-2">
            <TextLink to="/resources#case-studies" testId="home-explore-resources">Explore All Case Studies</TextLink>
          </Reveal>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 lg:gap-8" data-testid="home-result-cards">
          {cases.map((c, i) => (
            <Reveal key={c.id || c.title} delay={i * 90}>
              <Link
                to={`/case-studies/${slugify(c.title)}`}
                className="group flex flex-col h-full overflow-hidden transition-transform duration-500 hover:-translate-y-1.5"
                style={{ background: TINT[i % 3] }}
                data-testid={`home-case-card-${i}`}
              >
                <div className="overflow-hidden">
                  <img
                    src={c.image ? imgUrl(c.image) : ART[i % 3]}
                    alt={c.title || c.stat}
                    className="w-full aspect-[3/2] object-cover transition-transform duration-[900ms] group-hover:scale-[1.035]"
                    loading="lazy"
                    data-testid={`home-case-image-${i}`}
                  />
                </div>
                <div className="p-6 lg:p-7 flex flex-col flex-1">
                  <p className="font-sans text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: C.gold }}>{c.tag}</p>
                  <h3 className="font-serif font-medium text-[24px] lg:text-[27px] leading-[1.18] mt-3" style={{ color: C.navy }}>{c.stat || c.title}</h3>
                  <p className="text-[14.5px] leading-[1.68] mt-4" style={{ color: C.text }}>{excerpt(c.summary || c.body)}</p>
                  <span className="mt-auto pt-7 inline-flex items-center gap-2 font-sans font-semibold text-[13.5px] self-start" style={{ color: C.royal }} data-testid={`home-case-study-${i}`}>
                    <span className="pb-1 border-b-2" style={{ borderColor: C.gold }}>Read the Case Study</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeResults;
