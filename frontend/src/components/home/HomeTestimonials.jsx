import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "../common";
import { api } from "../../lib/api";
import { testimonials as fallback } from "../../mock/mock";
import { Eyebrow, H2, Dot, C } from "./HomeUi";

const pad = (n) => String(n).padStart(2, "0");

const HomeTestimonials = () => {
  const [items, setItems] = useState(fallback);
  const [i, setI] = useState(0);
  useEffect(() => { api.get("/content/testimonials").then(({ data }) => { if (data?.length) setItems(data); }).catch(() => {}); }, []);
  const next = useCallback(() => setI((v) => (v + 1) % items.length), [items.length]);
  const prev = () => setI((v) => (v - 1 + items.length) % items.length);
  useEffect(() => { const id = setInterval(next, 7000); return () => clearInterval(id); }, [next]);
  const t = items[i] || {};
  return (
    <section className="py-12 lg:py-16" style={{ background: C.ice }} data-testid="home-testimonials">
      <div className="container-x">
        <div className="flex items-center justify-between gap-6">
          <Reveal><Eyebrow>What Our Clients Say</Eyebrow></Reveal>
          <div className="flex items-center gap-3">
            <button onClick={prev} aria-label="Previous testimonial" className="w-9 h-9 rounded-full bg-white border border-[#c9d6ea] inline-flex items-center justify-center transition-colors hover:bg-[#f2a91c] hover:border-[#f2a91c]" style={{ color: C.royal }} data-testid="home-testimonial-prev"><ArrowLeft size={16} /></button>
            <button onClick={next} aria-label="Next testimonial" className="w-9 h-9 rounded-full bg-white border border-[#c9d6ea] inline-flex items-center justify-center transition-colors hover:bg-[#f2a91c] hover:border-[#f2a91c]" style={{ color: C.royal }} data-testid="home-testimonial-next"><ArrowRight size={16} /></button>
            <span className="font-sans text-[13px] font-semibold tabular-nums ml-2" style={{ color: C.royal }} data-testid="home-testimonial-counter"><span style={{ color: C.gold }}>{pad(i + 1)}</span> / {pad(items.length)}</span>
          </div>
        </div>
        <Reveal delay={80}><H2 className="mt-5">Long-Term Relationships<Dot /> Ongoing Responsibility<Dot /></H2></Reveal>
        <div className="mt-10 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-9 min-h-[190px]">
            <AnimatePresence mode="wait">
              <motion.blockquote key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }} data-testid="home-testimonial-quote">
                <p className="font-serif text-[19px] sm:text-[24px] leading-[1.4]" style={{ color: C.deep }}>
                  <span style={{ color: C.gold }}>“ </span>{t.quote}<span style={{ color: C.gold }}> ”</span>
                </p>
                <footer className="mt-6 font-sans text-[14px]">
                  <span className="font-bold" style={{ color: C.deep }}>{t.role}</span>
                  {t.since && <span className="text-[#5f7396]"> &nbsp;—&nbsp; {String(t.since).replace(/^ITG /, "Intrinsic ")}</span>}
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <Reveal delay={150} className="lg:col-span-3 lg:pl-6">
            <span className="block w-9 h-[2px]" style={{ background: C.gold }} />
            <p className="mt-4 font-sans text-[12px] font-bold tracking-[0.22em] uppercase leading-[1.9]" style={{ color: C.green }}>Trusted<br />Partnerships<br />Stronger<br />Organizations</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
