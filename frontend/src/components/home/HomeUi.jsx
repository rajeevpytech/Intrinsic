import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const C = {
  navy: "#0f3d94", royal: "#1d4fbf", deep: "#173b8a", text: "#3c5689", gold: "#f2a91c",
  green: "#3f6153", greenLight: "#9fcdb9", sage: "#e3ebe7", ice: "#eaf2fa", rule: "#d5deea",
};

export const Eyebrow = ({ children, light = false, className = "" }) => (
  <p className={`flex items-center gap-3 font-sans text-[11px] font-bold tracking-[0.2em] uppercase ${className}`} style={{ color: light ? "rgba(255,255,255,0.92)" : C.gold }}>
    {light ? <span className="block w-7 h-[2px]" style={{ background: C.gold }} /> : <span className="block w-7 h-[2px]" style={{ background: C.gold }} />}
    <span style={{ color: light ? "rgba(255,255,255,0.92)" : C.gold }}>{children}</span>
  </p>
);

/* Serif heading; use <Dot color/> for coloured punctuation */
export const H2 = ({ children, className = "", color = C.royal }) => (
  <h2 className={`font-serif font-medium text-[32px] sm:text-[40px] lg:text-[44px] leading-[1.12] tracking-[-0.01em] ${className}`} style={{ color }}>{children}</h2>
);
export const Dot = ({ color = C.gold, children = "." }) => <span style={{ color }}>{children}</span>;

export const GoldButton = ({ children, to, href = "#contact", testId, className = "" }) => {
  const cls = `btn-amber ${className}`;
  const inner = <><span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></>;
  return to ? <Link to={to} className={cls} data-testid={testId}>{inner}</Link> : <a href={href} className={cls} data-testid={testId}>{inner}</a>;
};

export const TextLink = ({ children, to, testId, className = "" }) => (
  <Link to={to} className={`group inline-flex flex-col font-sans font-semibold text-[14px] ${className}`} style={{ color: C.royal }} data-testid={testId}>
    <span className="inline-flex items-center gap-2">{children}<ArrowRight size={15} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1" /></span>
    <span className="block h-[2px] mt-1.5 w-full origin-left transition-transform duration-300 group-hover:scale-x-110" style={{ background: C.gold }} />
  </Link>
);

export const Body = ({ children, className = "", color = C.text }) => (
  <p className={`text-[15.5px] leading-[1.72] ${className}`} style={{ color }}>{children}</p>
);
