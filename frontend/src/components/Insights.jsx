import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./common";
import { api, imgUrl } from "../lib/api";

const Insights = () => {
  const [posts, setPosts] = useState([]);
  const [site, setSite] = useState({
    resources_heading: "Practical Insights for Better Technology Decisions",
    resources_sub: "Whether you're planning your next IT investment, navigating compliance requirements, or strengthening your cybersecurity strategy, you'll find resources designed to turn complexity into clarity.",
  });

  useEffect(() => {
    api.get("/content/blogs").then(({ data }) => setPosts(data || [])).catch(() => {});
    api.get("/content-site").then(({ data }) => setSite((s) => ({ ...s, ...data }))).catch(() => {});
  }, []);

  return (
    <section id="resources" className="bg-ice py-24 lg:py-28">
      <div className="container-x">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
            <div>
              <h2 className="font-serif text-midnight font-semibold text-[32px] sm:text-[42px] leading-[1.06]">
                {site.resources_heading}
              </h2>
              <p className="text-slatesage text-[16px] leading-relaxed mt-6 max-w-[560px]">{site.resources_sub}</p>
            </div>
            <div className="lg:justify-self-end">
              <Link to="/resources" className="btn-outline" data-testid="resources-read-more">
                <span>Read More</span>
                <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
              </Link>
            </div>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <Reveal key={p.id || p.title} delay={i * 100}>
              <article className="group bg-white border border-powder/70 h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgba(8,76,152,0.5)] hover:border-navy/30" data-testid={`insight-card-${i}`}>
                {p.image && (
                  <div className="img-zoom h-[210px]">
                    <img src={imgUrl(p.image)} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-7 flex flex-col flex-1">
                  {p.category && (
                    <span className="self-start eyebrow text-[10px] px-2.5 py-1 text-midnight" style={{ backgroundColor: p.catColor || "#c8d2de" }}>{p.category}</span>
                  )}
                  <h3 className="font-serif text-[22px] text-midnight mt-4 leading-snug group-hover:text-navy transition-colors">{p.title}</h3>
                  <p className="text-slatesage text-[14.5px] leading-relaxed mt-3">{p.excerpt}</p>
                  <div className="mt-auto pt-6 text-slatesage text-[12.5px]">
                    <span className="font-semibold text-midnight">{p.author}</span>
                    <div className="mt-1">{p.date}{p.read ? ` · ${p.read}` : ""}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Insights;
