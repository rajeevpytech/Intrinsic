import React from "react";
import { ArrowRight } from "lucide-react";

export const SKY = "#eaf3fb", SLATE = "#5b7f80", NAVY = "#0b3f95", ORANGE = "#f2a91c";

export const P = ({ children, light, className = "" }) => <p className={`text-[16px] leading-[1.7] ${light ? "text-white/90" : "text-[#4a5259]"} ${className}`}>{children}</p>;
export const Btn = ({ children, testId }) => (
  <button type="button" data-contact-trigger className="btn-amber" data-testid={testId}><span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></button>
);
export const Tags = ({ items, light, testId, className = "" }) => (
  <p className={`font-sans text-[10.5px] font-bold tracking-[0.18em] uppercase leading-[2.2] ${light ? "text-white/85" : "text-royal"} ${className}`} data-testid={testId}>
    {items.map((t, i) => <span key={t}>{t}{i < items.length - 1 && <span className="mx-3 text-amber">·</span>}</span>)}
  </p>
);
export const Box = ({ Icon, size = 56, light, round }) => (
  <span className={`inline-flex items-center justify-center border-[1.5px] shrink-0 ${round ? "rounded-full" : "rounded-lg"} ${light ? "bg-white/10 border-white text-white" : "bg-white border-royal text-royal"}`} style={{ width: size, height: size }}><Icon size={size * 0.45} strokeWidth={1.5} /></span>
);
export const Label = ({ t, s, light, align = "left" }) => (
  <div className={`text-${align}`}>
    <p className={`font-sans text-[10.5px] font-bold tracking-[0.12em] uppercase leading-[1.3] ${light ? "text-white" : "text-royal"}`}>{t}</p>
    {s && <p className={`font-sans text-[11px] mt-1 leading-[1.4] ${light ? "text-white/75" : "text-[#4a5259]"}`}>{s}</p>}
  </div>
);
export const Dot = ({ x, y }) => <span className="absolute w-2.5 h-2.5 rounded-full -ml-[5px] -mt-[5px]" style={{ left: `${x}%`, top: `${y}%`, background: ORANGE }} />;
export const Lines = ({ d, light }) => (
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" fill="none" aria-hidden="true">
    {d.map((p, i) => <path key={i} d={p} stroke={light ? "#ffffff" : NAVY} strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeOpacity="0.8" />)}
  </svg>
);
export const GreenBand = ({ children, testId, className = "" }) => (
  <section className={`relative text-white overflow-hidden hero-grain ${className}`} data-testid={testId}>
    <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, #4f7172 0%, ${SLATE} 55%, #678a8b 100%)` }} />
    <div className="container-x relative z-10">{children}</div>
  </section>
);
