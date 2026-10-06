import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const C = { navy: "#00388e", royal: "#1e56b8", sky: "#8fb4e6", pale: "#dbe7f5", ice: "#eef3fa", sage: "#7c9484", moss: "#4d6d5c", cream: "#e8e4d8", gold: "#f2a91c", white: "#ffffff" };

export const AiEyebrow = ({ children, light = false, className = "" }) => (
  <p className={`ai-eyebrow ${light ? "ai-eyebrow--light" : ""} ${className}`}><span className="ai-eyebrow-rule" />{children}</p>
);

export const GoldBtn = ({ children, to, testId, className = "" }) => {
  const inner = <><span>{children}</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></>;
  if (to) return <Link to={to} className={`btn-amber ${className}`} data-testid={testId}>{inner}</Link>;
  return <button type="button" data-contact-trigger className={`btn-amber ${className}`} data-testid={testId}>{inner}</button>;
};

export const NavyBtn = ({ children, to, testId, className = "" }) => {
  const inner = <><span>{children}</span><ArrowRight size={14} strokeWidth={2.5} /></>;
  if (to) return <Link to={to} className={`ai-navy-btn ${className}`} data-testid={testId}>{inner}</Link>;
  return <button type="button" data-contact-trigger className={`ai-navy-btn ${className}`} data-testid={testId}>{inner}</button>;
};

export const ExploreLink = ({ children, to, testId, light = false }) => (
  <Link to={to} className={`ai-explore ${light ? "ai-explore--light" : ""}`} data-testid={testId}>{children}<ArrowRight size={13} strokeWidth={2.5} /></Link>
);

/* ---- Abstract block mosaic (drifting rectangles) ---- */
const MOSAICS = {
  hero: [
    [0, 0, 100, 100, C.navy, 1], [58, 0, 42, 46, C.royal, 1], [70, 46, 30, 54, "#0a2f70", 1], [46, 28, 26, 44, C.sky, 0.85],
    [62, 62, 22, 24, C.pale, 0.9], [30, 70, 24, 30, C.royal, 0.9], [84, 22, 4, 26, C.gold, 1], [40, 12, 8, 30, C.pale, 0.4],
  ],
  managed: [
    [0, 0, 100, 100, "#0a2f70", 1], [0, 0, 44, 100, C.navy, 1], [44, 0, 30, 52, C.royal, 1], [74, 30, 26, 40, C.sage, 0.9],
    [58, 52, 30, 48, C.sky, 0.55], [20, 60, 30, 40, C.pale, 0.35], [86, 0, 14, 30, C.pale, 0.5], [70, 12, 4, 40, C.gold, 1],
  ],
  gov: [
    [0, 0, 100, 100, C.navy, 1], [50, 0, 50, 60, C.royal, 0.95], [64, 20, 36, 60, C.sage, 0.85], [0, 40, 40, 60, C.sky, 0.7],
    [30, 55, 44, 30, C.pale, 0.55], [70, 60, 30, 40, C.cream, 0.8], [44, 24, 20, 24, C.ice, 0.35], [62, 40, 4, 36, C.gold, 1],
  ],
  copilot: [
    [8, 0, 40, 50, C.pale, 1], [30, 22, 36, 42, C.sky, 0.9], [46, 34, 34, 42, C.navy, 1], [66, 46, 30, 30, C.sage, 0.9],
    [58, 60, 22, 22, C.gold, 1], [12, 60, 30, 26, C.ice, 1], [0, 34, 20, 20, C.pale, 0.6],
  ],
  ongoing: [
    [0, 0, 100, 100, "#3d5a4c", 1], [46, 0, 54, 46, C.sage, 0.9], [66, 20, 34, 60, "#2e4a3e", 1], [30, 50, 36, 50, C.sky, 0.5],
    [56, 56, 26, 24, C.navy, 0.9], [80, 48, 20, 22, C.gold, 1], [0, 60, 30, 40, C.cream, 0.35],
  ],
};

export const Mosaic = ({ variant = "hero", className = "", letters, motionStyle }) => {
  const rects = MOSAICS[variant] || MOSAICS.hero;
  const reducedMotion = useReducedMotion();
  const governance = motionStyle === "governance";
  const animate = governance && !reducedMotion;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`ai-mosaic ${className}`} aria-hidden="true" data-testid={`ai-mosaic-${variant}`} data-motion={motionStyle}>
      {rects.map(([x, y, w, h, fill, o], i) => {
        if (!animate || i === 0) return <rect key={i} x={x} y={y} width={w} height={h} fill={fill} fillOpacity={o} className={!governance && i ? "ai-block" : ""} style={{ "--i": i }} />;
        return (
          <motion.g key={i} data-testid={`managed-mosaic-block-${i}`}
            initial={{ opacity: 0, scaleY: 0.6 }} whileInView={{ opacity: 1, scaleY: 1 }} viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.15 + (i - 1) * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${x + w / 2}px ${y + h}px`, transformBox: "view-box" }}>
            <motion.g data-testid={fill === C.gold ? "managed-mosaic-gold" : undefined}
              animate={{ y: [0, -(fill === C.gold ? 6 : 1.5), 0] }}
              transition={{ duration: fill === C.gold ? 6 : 9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}>
              <rect x={x} y={y} width={w} height={h} fill={fill} fillOpacity={o} />
            </motion.g>
          </motion.g>
        );
      })}
      {letters && (
        <motion.text x="50" y="72" textAnchor="middle" className="ai-letters" fill={C.pale} fillOpacity="0.55" style={{ fontSize: letters.length > 2 ? 34 : 64 }} preserveAspectRatio="none"
          initial={animate ? { opacity: 0 } : false} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.45, duration: 0.8 }}>{letters}</motion.text>
      )}
    </svg>
  );
};

/* ---- Small tile art for cards ---- */
export const MiniArt = ({ kind = "grid", className = "" }) => (
  <svg viewBox="0 0 120 90" className={`ai-mini ${className}`} aria-hidden="true">
    {kind === "grid" && <>
      <rect x="0" y="0" width="120" height="90" fill={C.ice} /><rect x="86" y="0" width="34" height="90" fill={C.navy} />
      <rect x="26" y="14" width="22" height="22" fill={C.sky} /><rect x="50" y="14" width="22" height="22" fill={C.royal} /><rect x="26" y="38" width="22" height="22" fill={C.pale} /><rect x="50" y="38" width="22" height="22" fill={C.gold} className="ai-mini-pulse" />
    </>}
    {kind === "flow" && <>
      <rect x="0" y="0" width="120" height="90" fill={C.ice} /><rect x="96" y="0" width="24" height="90" fill={C.navy} />
      <line x1="14" y1="45" x2="96" y2="45" stroke={C.sky} strokeWidth="2" />
      {[18, 38, 58, 78].map((x, k) => <rect key={x} x={x} y={k % 2 ? 24 : 34} width="12" height={k % 2 ? 42 : 22} fill={k === 2 ? C.gold : k % 2 ? C.royal : C.sky} className="ai-mini-bar" style={{ "--k": k }} />)}
    </>}
    {kind === "docs" && <>
      <rect x="0" y="0" width="120" height="90" fill={C.ice} /><rect x="0" y="0" width="30" height="90" fill={C.navy} />
      {[0, 1, 2].map((k) => <rect key={k} x={44 + k * 12} y={12 + k * 8} width="40" height="54" fill={k === 2 ? C.white : k === 1 ? C.pale : C.sky} stroke={C.sky} strokeWidth="1" className="ai-mini-doc" style={{ "--k": k }} />)}
      {[0, 1, 2, 3].map((k) => <rect key={k} x="74" y={36 + k * 7} width={22 - k * 4} height="2.5" fill={k === 1 ? C.gold : C.royal} />)}
    </>}
    {kind === "ops" && <>
      <rect x="0" y="0" width="120" height="90" fill={C.ice} /><rect x="0" y="0" width="30" height="90" fill={C.navy} />
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x="44" y={14 + k * 13} width={[60, 36, 48, 26, 56][k]} height="6" fill={k === 1 ? C.gold : k % 2 ? C.sky : C.royal} className="ai-mini-bar" style={{ "--k": k }} />)}
    </>}
    {kind === "circle" && <>
      <rect x="0" y="0" width="120" height="90" fill={C.ice} /><circle cx="60" cy="45" r="30" fill={C.navy} /><circle cx="72" cy="45" r="24" fill={C.sky} className="ai-mini-pulse" /><rect x="0" y="0" width="14" height="90" fill={C.pale} />
    </>}
    {kind === "squares" && <>
      <rect x="0" y="0" width="120" height="90" fill={C.ice} /><rect x="20" y="10" width="44" height="44" fill={C.pale} /><rect x="40" y="26" width="44" height="44" fill={C.navy} /><rect x="64" y="46" width="30" height="30" fill={C.sage} /><rect x="60" y="14" width="18" height="18" fill={C.gold} className="ai-mini-pulse" />
    </>}
    {kind === "bars" && <>
      <rect x="0" y="0" width="120" height="90" fill={C.ice} />
      {[0, 1, 2, 3].map((k) => <rect key={k} x={24 + k * 20} y={70 - [26, 40, 32, 52][k]} width="14" height={[26, 40, 32, 52][k]} fill={k === 3 ? C.gold : k % 2 ? C.royal : C.sky} className="ai-mini-bar" style={{ "--k": k }} />)}
    </>}
  </svg>
);

/* ---- Concrete-wall photo with blue band (readiness/governance) ---- */
export const PhotoBand = ({ className = "" }) => (
  <div className={`relative overflow-hidden ${className}`} data-testid="ai-photo-band">
    <img src="https://images.unsplash.com/photo-1486718448742-163732cd1544?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200" alt="" className="absolute inset-0 w-full h-full object-cover" />
    <span className="absolute top-0 bottom-0 right-0 w-[26%]" style={{ background: C.navy, opacity: 0.92 }} />
    <span className="absolute top-0 bottom-0 right-[26%] w-[10%]" style={{ background: C.sky, opacity: 0.55 }} />
  </div>
);

/* ---- Readiness report card ---- */
export const ReportCard = ({ rows }) => (
  <div className="relative" data-testid="ai-report-card">
    <span className="absolute -top-8 -left-8 right-16 bottom-16 bg-[#3a6fd0]/40" />
    <span className="absolute -top-4 -left-4 right-8 bottom-8 bg-[#5b8de0]/40" />
    <div className="relative bg-white p-7 sm:p-9 shadow-[0_40px_80px_-40px_rgba(0,20,60,0.6)]">
      <p className="font-sans text-[#00388e] font-bold text-[15px]">AI Readiness Assessment</p>
      <div className="mt-6 space-y-4">
        {rows.map((r, i) => (
          <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-5">
            <span className="text-[12.5px] text-[#2e3745]">{r.label}</span>
            <span className="flex gap-1">
              {r.cells.map((c, k) => <span key={k} className="ai-cell" style={{ background: c, "--k": k, "--i": i }} />)}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
