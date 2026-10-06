import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Building2, Stethoscope, HeartHandshake, HardHat, ShoppingBag, Scale } from "lucide-react";
import { Reveal } from "./common";
import { industries, businessChips } from "../mock/mock";
import { slugify } from "./WhatWeDo";

const chipIcons = { Healthcare: Stethoscope, Legal: Scale, "Financial services": Building2, Construction: HardHat, "Non-profit": HeartHandshake, Retail: ShoppingBag };
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
const findIndex = (name) => industries.findIndex((ind) => norm(ind.name) === norm(name));
const EASE = "transform 700ms cubic-bezier(0.22, 0.61, 0.36, 1)";
const isLight = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 170; };

const Industries = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();
  const total = industries.length;
  const active = industries[index];
  const go = useCallback((dir) => setIndex((p) => (p + dir + total) % total), [total]);

  useEffect(() => {
    if (paused || dragging) return;
    const id = setInterval(() => go(1), 5000);
    return () => clearInterval(id);
  }, [paused, dragging, go]);

  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    drag.current = { x: e.clientX, moved: false };
    setDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 6) drag.current.moved = true;
    setDragX(Math.max(-320, Math.min(320, dx)));
  };
  const onUp = (e) => {
    const d = drag.current; drag.current = null;
    setDragging(false); setDragX(0);
    if (!d) return;
    const dx = e.clientX - d.x;
    const w = trackRef.current?.offsetWidth || 800;
    if (Math.abs(dx) > Math.min(80, w * 0.12)) go(dx < 0 ? 1 : -1);
    else if (!d.moved && !e.target.closest("a")) navigate(`/industries/${slugify(active.name)}`);
  };

  return (
    <section id="industries" className="bg-ice py-24 lg:py-28">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          <Reveal>
            <h2 className="font-serif text-navy font-semibold text-[32px] sm:text-[42px] leading-[1.06]">
              Technology solutions shaped around the way your organization operates.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-slatesage text-[16px] leading-relaxed">
              Every organization has unique priorities, requirements, regulations, and risks.
              Intrinsic combines industry knowledge with technology expertise to design and manage
              environments that support how your teams work—securely, efficiently, and compliantly.
            </p>
            <p className="font-semibold text-midnight mt-5 text-[16px]">Industry knowledge. Technology expertise. One accountable partner.</p>
            <p className="eyebrow text-slatesage mt-7 mb-3">What does your business do?</p>
            <div className="flex flex-wrap gap-2">
              {businessChips.map((b) => {
                const Icon = chipIcons[b] || Building2;
                const i = findIndex(b);
                const isActive = i === index;
                return (
                  <button key={b} onClick={() => i >= 0 && setIndex(i)} data-testid={`industry-chip-${b}`}
                    style={isActive ? { backgroundColor: industries[i].color, borderColor: industries[i].color } : undefined}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-[13px] transition-all duration-300 ${isActive ? `${isLight(industries[i].color) ? "text-midnight" : "text-white"} shadow-md` : "bg-white border-powder text-slatesage hover:border-navy hover:text-navy hover:-translate-y-0.5"}`}>
                    <Icon size={13} /> {b}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="relative flex min-h-[460px] overflow-hidden shadow-[0_30px_60px_-30px_rgba(8,76,152,0.45)] bg-midnight"
            onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} data-testid="industry-panel">
            {/* six colour tabs */}
            <div className="flex shrink-0 z-20" role="tablist" aria-label="Industries">
              {industries.map((ind, i) => {
                const on = i === index;
                return (
                  <button key={ind.name} role="tab" aria-selected={on} aria-label={ind.name} title={ind.name}
                    onClick={() => setIndex(i)} data-testid={`industry-tab-${i}`}
                    style={{ backgroundColor: ind.color, transition: "width 600ms cubic-bezier(0.22,0.61,0.36,1), filter 300ms" }}
                    className={`group relative overflow-hidden ${on ? "w-[62px] sm:w-[72px]" : "w-[22px] sm:w-[30px] hover:w-[40px] hover:brightness-110"}`}>
                    <span className={`absolute inset-0 flex items-center justify-center ${isLight(ind.color) ? "text-midnight" : "text-white"} text-[11.5px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap [writing-mode:vertical-rl] rotate-180 transition-opacity duration-500 ${on ? "opacity-100 delay-200" : "opacity-0"}`}>
                      {ind.name}
                    </span>
                    {on && <span className="absolute left-0 top-0 h-full w-[3px] bg-white/70" />}
                  </button>
                );
              })}
            </div>

            {/* sliding track */}
            <div ref={trackRef} className={`relative flex-1 min-w-0 overflow-hidden select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{ touchAction: "pan-y" }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} data-testid="industry-track">
              <div className="flex h-full" style={{ transform: `translateX(calc(${-index * 100}% + ${dragX}px))`, transition: dragging ? "none" : EASE }}>
                {industries.map((ind, i) => (
                  <div key={ind.name} className="w-full shrink-0 relative min-h-[460px] flex" aria-hidden={i !== index}
                    style={{ backgroundImage: `linear-gradient(to right, rgba(26,26,46,0.9) 0%, rgba(26,26,46,0.62) 60%, rgba(26,26,46,0.35) 100%), url(${ind.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                    <div key={i === index ? `on-${index}` : `off-${i}`} className={`p-9 lg:p-12 max-w-[600px] flex flex-col ${i === index ? "animate-fade-up" : "opacity-0"}`}>
                      <span className="eyebrow mb-4" style={{ color: ind.color }}>Industry {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
                      <h3 className="font-serif text-white text-[30px] lg:text-[36px] font-semibold">{ind.name}</h3>
                      <p className="text-white/85 text-[15px] leading-relaxed mt-5">{ind.body}</p>
                      <Link to={`/industries/${slugify(ind.name)}`} className="mt-auto pt-8 inline-flex items-center gap-2 eyebrow text-white group" data-testid="industry-explore">
                        Explore More <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                    <span className="absolute bottom-0 left-0 right-0 h-[4px]" style={{ backgroundColor: ind.color }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            {industries.map((ind, i) => (
              <button key={ind.name} onClick={() => setIndex(i)} aria-label={ind.name} data-testid={`industry-dot-${i}`}
                style={{ backgroundColor: ind.color, opacity: i === index ? 1 : 0.35 }}
                className={`h-2.5 transition-all duration-500 hover:opacity-100 ${i === index ? "w-9" : "w-2.5"}`} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => go(-1)} className="w-12 h-12 border border-powder bg-white flex items-center justify-center hover:border-navy hover:text-navy transition-colors" aria-label="Previous" data-testid="industry-prev"><ArrowLeft size={18} /></button>
            <button onClick={() => go(1)} className="w-12 h-12 border border-powder bg-white flex items-center justify-center hover:border-navy hover:text-navy transition-colors" aria-label="Next" data-testid="industry-next"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Industries;
