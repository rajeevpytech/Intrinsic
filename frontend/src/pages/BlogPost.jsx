import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ScrollProgress, Reveal } from "../components/common";
import Markdown from "../components/Markdown";
import { api, imgUrl, API } from "../lib/api";
import { slugify } from "../lib/slug";
import { usePageSeo } from "../lib/SeoContext";

export default function BlogPost() {
  const { slug } = useParams();
  const [list, setList] = useState(null);

  useEffect(() => {
    api.get("/content/blogs").then(({ data }) => setList(data || [])).catch(() => setList([]));
  }, []);

  const all = list || [];
  const post = all.find((p) => slugify(p.title) === slug || p.id === slug);
  const others = all.filter((p) => p !== post).slice(0, 3);
  const hero = post?.image ? imgUrl(post.image) : "";
  const ogImage = post ? (post.og_image ? imgUrl(post.og_image) : `${API}/og/blogs/${slugify(post.title)}.png`) : "";

  usePageSeo(post ? {
    title: post.seo_title || post.title,
    description: post.seo_description || post.geo_summary || post.excerpt || String(post.content || "").slice(0, 180),
    keywords: post.seo_keywords || post.category,
    image: ogImage,
    type: "article",
    jsonLd: [{
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.seo_title || post.title,
      description: post.seo_description || post.geo_summary || post.excerpt,
      image: ogImage || undefined,
      author: { "@type": "Person", name: post.author || "Intrinsic Technology" },
      publisher: { "@type": "Organization", name: "Intrinsic Technology" },
      articleSection: post.category || undefined,
    }],
  } : null);

  return (
    <div className="bg-white page-in" data-testid="blog-post-page">
      <ScrollProgress />
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        {list && !post ? (
          <section className="container-x py-24 text-center" data-testid="blog-post-missing">
            <h1 className="font-serif font-semibold text-[32px] text-royal">This article is not published yet.</h1>
            <Link to="/resources#articles" className="btn-amber mt-8 inline-flex"><span>Back to Resources</span><span className="btn-arrow"><ArrowRight size={14} /></span></Link>
          </section>
        ) : post ? (
          <>
            <section className="no-hero-fill pt-6 lg:pt-10" data-testid="blog-post-header">
              <div className="mx-auto w-full max-w-[860px] px-6 lg:px-10">
                <div className="flex flex-wrap items-center gap-2 text-[12px] font-sans">
                  <Link to="/resources#articles" className="font-bold tracking-[0.14em] uppercase text-navy hover:text-royal transition-colors inline-flex items-center gap-1.5" data-testid="blog-post-back"><ArrowLeft size={13} />Articles</Link>
                  {post.category && <span className="eyebrow text-[10px] px-2 py-1 text-midnight" style={{ backgroundColor: post.catColor || "#eef2f8" }} data-testid="blog-post-category">{post.category}</span>}
                </div>
                <Reveal>
                  <h1 className="font-serif font-semibold text-[32px] sm:text-[44px] leading-[1.08] text-royal mt-5" data-testid="blog-post-title">{post.title}</h1>
                </Reveal>
                {post.excerpt && <p className="text-slatesage text-[17px] leading-[1.6] mt-5 max-w-[680px]" data-testid="blog-post-excerpt">{post.excerpt}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slatesage mt-6 pt-5 border-t border-powder/70" data-testid="blog-post-meta">
                  {post.author && <span className="font-semibold text-midnight">{post.author}</span>}
                  {post.date && <span>{post.date}</span>}
                  {post.read && <span>· {post.read}</span>}
                </div>
              </div>
            </section>

            {hero && (
              <section className="mt-8 lg:mt-10" data-testid="blog-post-hero">
                <div className="mx-auto w-full max-w-[1000px] px-6 lg:px-10">
                  <Reveal>
                    <div className="w-full overflow-hidden" style={{ backgroundColor: post.catColor || "#eef2f8" }}>
                      <img src={hero} alt={post.title} className="w-full h-auto object-cover max-h-[460px]" data-testid="blog-post-image" />
                    </div>
                  </Reveal>
                </div>
              </section>
            )}

            <section className="mt-6 lg:mt-10 pb-6" data-testid="blog-post-body">
              <div className="mx-auto w-full max-w-[760px] px-6 lg:px-10">
                {post.content && String(post.content).trim()
                  ? <Markdown>{post.content}</Markdown>
                  : <p className="text-[#2e3745] text-[16.5px] leading-[1.85] my-5">{post.excerpt}</p>}
              </div>
            </section>

            {others.length > 0 && (
              <section className="py-12 lg:py-16 border-t border-powder/60" data-testid="blog-post-more">
                <div className="container-x">
                  <p className="eyebrow text-[#c07f11] mb-8">More articles</p>
                  <div className="grid md:grid-cols-3 gap-6">
                    {others.map((o, i) => (
                      <Link key={o.id} to={`/blog/${slugify(o.title)}`} className="group border border-powder/70 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-navy/30" data-testid={`blog-post-more-${i}`}>
                        {o.category && <p className="font-sans font-bold text-[12px] tracking-[0.1em] uppercase text-royal">{o.category}</p>}
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
