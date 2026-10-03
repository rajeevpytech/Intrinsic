import React, { useState, useEffect, useCallback } from "react";
import { Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./common";
import { testimonials as fallbackT } from "../mock/mock";
import { api } from "../lib/api";

const PER = { base: 1, lg: 2 };

const Testimonials = () => {
  const [perView, setPerView] = useState(1);
  const [page, setPage] = useState(0);
  const [testimonials, setTestimonials] = useState(fallbackT);

  useEffect(() => {
    api.get("/content/testimonials").then(({ data }) => { if (data?.length) setTestimonials(data); }).catch(() => {});
  }, []);

  useEffect(() => {
    const set = () => setPerView(window.innerWidth >= 1024 ? PER.lg : PER.base);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  const pages = Math.ceil(testimonials.length / perView);

  const next = useCallback(() => setPage((p) => (p + 1) % pages), [pages]);
  const prev = () => setPage((p) => (p - 1 + pages) % pages);

  useEffect(() => {
    if (page >= pages) setPage(0);
  }, [pages, page]);

  useEffect(() => {
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative bg-white py-24 lg:py-28 overflow-hidden" data-testid="testimonials-section">
      <Quote className="absolute -top-6 right-8 text-ice pointer-events-none" size={220} strokeWidth={1} />
      <div className="container-x relative z-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <h2 className="font-serif text-midnight font-semibold text-[32px] sm:text-[42px] leading-[1.06] max-w-[720px]">
              Testimonials
            </h2>
            <div className="flex items-center gap-3">
              <button onClick={prev} className="w-12 h-12 border border-powder flex items-center justify-center hover:border-navy hover:text-navy transition-colors" aria-label="Previous" data-testid="testimonial-prev">
                <ArrowLeft size={18} />
              </button>
              <button onClick={next} className="w-12 h-12 border border-powder flex items-center justify-center hover:border-navy hover:text-navy transition-colors" aria-label="Next" data-testid="testimonial-next">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Track */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="w-full lg:w-1/2 shrink-0 px-0 lg:px-3 first:pl-0">
                <figure className="relative bg-ice p-8 lg:p-10 h-full border-l-4 border-amber">
                  <span className="inline-flex items-center justify-center w-11 h-11 bg-navy text-white shrink-0 mb-6">
                    <Quote size={20} />
                  </span>
                  <blockquote className="font-serif italic text-midnight text-[19px] lg:text-[22px] leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-7 pt-6 border-t border-powder">
                    <p className="font-semibold text-navy text-[15px]">{t.role}</p>
                    <p className="eyebrow text-slatesage mt-1">{t.since}</p>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 transition-all duration-300 ${i === page ? "w-8 bg-navy" : "w-2.5 bg-powder hover:bg-slatesage"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
