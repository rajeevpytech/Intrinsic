import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import { ArrowRight, ArrowUpRight, Mic, Search } from "lucide-react";
import { api, imgUrl } from "../lib/api";
import { slugify } from "../lib/slug";

const ts = (v) => {
  if (!v) return 0;
  const t = Date.parse(v);
  return Number.isNaN(t) ? 0 : t;
};

const ResourceCard = ({ item, i }) => {
  const inner = (
    <>
      <div
        className="relative overflow-hidden"
        style={{ background: item.tint, aspectRatio: "16 / 10" }}
        data-testid={`resource-card-image-${i}`}
      >
        {item.image ? (
          <img
            src={imgUrl(item.image)}
            alt={item.title}
            className={`w-full h-full ${item.fit || "object-cover"} ${item.pos || ""} transition-transform duration-[800ms] group-hover:scale-[1.05]`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><span className="font-serif text-royal/35 text-[20px]">{item.kind}</span></div>
        )}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-navy font-sans font-bold text-[10px] tracking-[0.13em] uppercase px-2.5 py-1 shadow-sm" data-testid={`resource-card-kind-${i}`}>
          {item.kind}
        </span>
      </div>
      <div className="flex flex-col flex-1 bg-white p-5">
        {item.tag && <p className="font-sans text-[10px] font-bold tracking-[0.14em] uppercase text-navy" data-testid={`resource-card-tag-${i}`}>{item.tag}</p>}
        <h3 data-testid={`resource-card-title-${i}`} className="font-serif font-medium text-[17px] leading-[1.25] text-royal mt-2 group-hover:text-navy transition-colors">{item.title}</h3>
        {item.desc && <p data-testid={`resource-card-description-${i}`} className="text-[14px] leading-[1.55] text-[#4a5568] mt-2 line-clamp-3">{item.desc}</p>}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[13px] text-navy">
            <span className="pb-0.5 border-b-2 border-[#f2a91c]">{item.action}</span>
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
          {item.meta && <span className="text-[11.5px] text-slatesage">{item.meta}</span>}
        </div>
      </div>
    </>
  );

  const cls = "group flex flex-col h-full overflow-hidden border border-powder/70 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_54px_-30px_rgba(8,76,152,0.5)] hover:border-navy/30";

  if (item.to) return <Link to={item.to} className={cls} data-testid={`resource-item-${i}`}>{inner}</Link>;
  return <div className={cls} data-testid={`resource-item-${i}`}>{inner}</div>;
};

const TYPES = ["All", "Case Studies", "Service Briefs", "Articles"];

const Resources = () => {
  const [posts, setPosts] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [cases, setCases] = useState([]);
  const [type, setType] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("Featured");
  const [listening, setListening] = useState(false);
  const [voiceMsg, setVoiceMsg] = useState("");
  const recRef = useRef(null);

  useEffect(() => {
    api.get("/content/blogs").then(({ data }) => setPosts(data || [])).catch(() => {});
    api.get("/content/service-briefs").then(({ data }) => setBriefs(data || [])).catch(() => {});
    api.get("/content/case-studies").then(({ data }) => setCases(data || [])).catch(() => {});
    return () => { try { recRef.current && recRef.current.stop(); } catch (e) {} };
  }, []);

  const scrollToResults = () => { try { document.getElementById("all-resources")?.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {} };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceMsg("Voice search needs Chrome, Edge, or Safari."); return; }
    if (!window.isSecureContext) { setVoiceMsg("Voice search requires a secure (https) connection."); return; }
    if (listening) { try { recRef.current && recRef.current.stop(); } catch (e) {} setListening(false); return; }
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = (e) => { const t = e.results?.[0]?.[0]?.transcript || ""; setQ(t.replace(/\.$/, "")); setVoiceMsg(""); setTimeout(scrollToResults, 200); };
    rec.onerror = (e) => {
      setListening(false);
      const err = e?.error;
      if (err === "not-allowed" || err === "service-not-allowed") setVoiceMsg("Please allow microphone access to use voice search.");
      else if (err === "no-speech") setVoiceMsg("Didn't catch that — tap the mic and try again.");
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setVoiceMsg("");
    setListening(true);
    try { rec.start(); } catch (e) { setListening(false); }
  };

  // Featured = the most recent case study, shown as a large highlight (not repeated in the grid).
  const gridCases = useMemo(() => [...cases], [cases]);

  const items = useMemo(() => {
    const cs = gridCases.map((c, i) => ({
      type: "Case Studies", kind: "Case Study",
      tag: c.tag, title: c.card_title || c.stat || c.title, desc: c.summary || c.body,
      image: c.image, tint: c.heroBg || "#eef2f8", fit: "object-contain", pos: "",
      to: `/case-studies/${slugify(c.title)}`, action: "Read the Case Study",
      order: 0, date: ts(c.created_at) || (Date.now() - i * 1000),
    }));
    const sb = briefs
      .filter((b) => b.available !== false && b.has_file && b.title)
      .map((b) => ({
        type: "Service Briefs", kind: "Service Brief",
        tag: b.service, title: b.title, desc: b.summary || b.subtitle,
        image: b.cover || null, tint: "#e9edf3", fit: "object-cover", pos: "object-top",
        to: `/contact?brief=${encodeURIComponent(b.id)}#contact-form-section`, action: "Request the Brief", meta: b.pages || null,
        order: 1, date: ts(b.created_at),
      }));
    const bl = posts.map((p) => ({
      type: "Articles", kind: "Article",
      tag: p.category, title: p.title, desc: p.excerpt,
      image: p.image || null, tint: p.catColor || "#eef2f8", fit: "object-cover", pos: "",
      to: p.to || `/blog/${slugify(p.title)}`, action: "Read Article", meta: p.read || p.date,
      order: 2, date: ts(p.date),
    }));
    return [...cs, ...sb, ...bl];
  }, [gridCases, briefs, posts]);

  const filtered = useMemo(() => {
    let list = type === "All" ? items : items.filter((it) => it.type === type);
    const term = q.trim().toLowerCase();
    if (term) list = list.filter((it) => `${it.kind} ${it.tag} ${it.title} ${it.desc}`.toLowerCase().includes(term));
    list = [...list].sort((a, b) => {
      if (sort === "Newest") return b.date - a.date;
      if (sort === "Oldest") return a.date - b.date;
      return a.order - b.order || b.date - a.date; // Featured: case studies first
    });
    return list;
  }, [items, type, q, sort]);

  const countFor = (t) => (t === "All" ? items.length : items.filter((it) => it.type === t).length);

  return (
    <div className="bg-ice page-in" data-testid="resources-page">
      <ScrollProgress />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-[var(--nav-h)]" style={{ background: "#00388e" }} data-testid="resources-hero">
          <div className="relative z-10 mx-auto w-full max-w-[1000px] px-6 lg:px-10 pt-16 lg:pt-20 pb-16 lg:pb-20" data-testid="resources-hero-content">
            <p className="mb-5 font-sans font-bold uppercase" style={{ fontSize: "15px", letterSpacing: "0.22em", color: "#ffffff" }}>Resource Center</p>
            <h1 data-testid="resources-hero-title" className="font-serif font-semibold text-white text-[42px] sm:text-[56px] leading-[1.04]">Case studies, service briefs, and practical insights.</h1>
            <p className="text-white text-[17px] leading-relaxed mt-6 max-w-[640px]">
              Everything in one place — read what we delivered for organizations like yours, download a two-page brief
              on any service, and browse guidance for planning technology investments.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); scrollToResults(); }} className="mt-9 max-w-[580px]" data-testid="resources-hero-search-form">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/55" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={listening ? "Listening…" : "Search case studies, briefs, articles…"}
                  data-testid="resources-hero-search"
                  className="w-full bg-white pl-12 pr-16 py-4 text-[15px] text-midnight placeholder:text-slatesage rounded-full shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] focus:outline-none focus:ring-2 focus:ring-[#f2a91c]"
                />
                <button
                  type="button"
                  onClick={startVoice}
                  data-testid="resources-hero-voice"
                  aria-label="Voice search"
                  title="Search by voice"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all ${listening ? "bg-[#f2a91c] text-midnight animate-pulse" : "bg-navy text-white hover:bg-royal"}`}
                >
                  <Mic size={17} />
                </button>
              </div>
              {(q || voiceMsg) && <p className="text-white/80 text-[12.5px] mt-3" data-testid="resources-hero-hint">{voiceMsg || `Showing results for “${q}” below.`}</p>}
            </form>
          </div>
        </section>

        {/* All resources */}
        <section id="all-resources" className="pt-14 lg:pt-20 pb-16 lg:pb-24 scroll-mt-[var(--nav-h)]" data-testid="resources-all">
          <div className="mx-auto w-full max-w-[1000px] px-6 lg:px-10">
            <h2 className="font-serif font-semibold text-[26px] sm:text-[32px] text-royal mb-8">All Resources</h2>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2.5 mb-10" data-testid="resource-type-filters">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  data-testid={`resource-type-${slugify(t)}`}
                  className={`px-3.5 py-1.5 text-[13px] font-medium border transition-all duration-200 ${type === t ? "bg-navy text-white border-navy" : "bg-white text-midnight border-powder hover:border-navy hover:text-navy"}`}
                >
                  {t} <span className="opacity-60">({countFor(t)})</span>
                </button>
              ))}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                data-testid="resource-sort"
                className="px-3 py-1.5 text-[13px] font-medium bg-white text-midnight border border-powder focus:outline-none focus:border-navy cursor-pointer lg:ml-auto"
              >
                <option>Featured</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7" data-testid="resource-grid">
              {filtered.map((it, i) => (
                <Reveal key={`${it.type}-${it.title}-${i}`} delay={(i % 3) * 70}>
                  <ResourceCard item={it} i={i} />
                </Reveal>
              ))}
            </div>
            {filtered.length === 0 && <p className="text-slatesage mt-8" data-testid="resources-empty">No resources match your search.</p>}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Resources;
