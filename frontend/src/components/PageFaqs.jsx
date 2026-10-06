import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { PAGE_FAQS } from "../lib/serviceFaqs";

// Visible buyer FAQ accordion for core service pages. Content matches the
// server-rendered FAQs (backend/ssr.py) so crawlers and visitors see the same.
export default function PageFaqs({ path }) {
  const loc = useLocation();
  const key = path || loc.pathname;
  const faqs = PAGE_FAQS[key] || [];
  const [open, setOpen] = useState(0);
  if (!faqs.length) return null;
  return (
    <section className="py-16 lg:py-20 bg-ice" data-testid="page-faqs">
      <div className="container-x max-w-[880px]">
        <p className="eyebrow text-[#c07f11] mb-3">FAQ</p>
        <h2 className="font-serif font-semibold text-[28px] sm:text-[36px] leading-tight text-royal">Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-powder/70 border-t border-powder/70">
          {faqs.map((f, i) => (
            <div key={i} className="py-5" data-testid={`faq-item-${i}`}>
              <button
                className="w-full flex items-start justify-between gap-6 text-left"
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                data-testid={`faq-q-${i}`}
              >
                <span className="font-serif text-[18px] sm:text-[20px] text-midnight font-medium">{f.q}</span>
                <ChevronDown size={20} className={`shrink-0 mt-1 text-navy transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <p className="text-slatesage text-[15.5px] leading-[1.75] mt-4 pr-10" data-testid={`faq-a-${i}`}>{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
