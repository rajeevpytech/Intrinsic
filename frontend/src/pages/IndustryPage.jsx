import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress } from "../components/common";
import { industryPages } from "../data/industries";
import ComingSoon from "./ComingSoon";
import { IndustryHero, TextSection, SecurityBand, CloudSection, PlanningSection, IndustryCTA, ContinuityAside, CardsSection } from "../components/industry/IndustrySections";

export default function IndustryPage() {
  const { slug } = useParams();
  const d = industryPages[slug];
  if (!d) return <ComingSoon />;
  return (
    <div className="bg-white page-in" data-testid={`industry-page-${slug}`}>
      <ScrollProgress />
      <Navbar />
      <main>
        <IndustryHero d={d} />
        {d.sections ? d.sections.map((s, i) => {
          if (s.type === "cards") return <CardsSection key={i} s={{ ...s, iconOffset: i === 0 || s.testId === "industry-security-cards" ? 0 : 4 }} color={d.color} />;
          if (s.type === "band") return <SecurityBand key={i} s={s} color={d.color} />;
          return <TextSection key={i} s={s} bg={i % 2 ? "bg-ice" : "bg-white"} />;
        }) : <>
        <TextSection s={d.environment} testId="industry-environment" />
        <TextSection s={d.managed} bg="bg-ice" testId="industry-managed" />
        <SecurityBand s={d.security} color={d.color} />
        <CloudSection s={d.cloud} />
        <TextSection s={d.continuity} testId="industry-continuity" aside={<ContinuityAside />} />
        <PlanningSection s={d.planning} color={d.color} />
        <TextSection s={d.why} testId="industry-why" />
        </>}
        <IndustryCTA s={d.cta} color={d.color} />
      </main>
      <Footer />
    </div>
  );
}
