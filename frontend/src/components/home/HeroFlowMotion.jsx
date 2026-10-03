import React from "react";
import { motion } from "framer-motion";

/* Animated overlay for /images/home-hero-flow.png (2000 x 667) */
const A = [1405, 222], B = [1405, 378], O = [1490, 300];
const LEFT = [272, 284, 296, 308, 320, 332].map((y, i) => {
  const [nx, ny] = i < 3 ? A : B;
  return `M1130 ${y} H1330 C1372 ${y}, 1378 ${ny}, ${nx} ${ny} C1440 ${ny}, 1458 ${O[1]}, ${O[0]} ${O[1]}`;
});
const RIGHT = [
  [1900, 20, 1600, 300, 1700, 60], [2000, 110, 1620, 300, 1760, 140], [2000, 230, 1640, 300, 1800, 240], [2000, 330, 1650, 300, 1800, 320],
  [2000, 440, 1640, 300, 1800, 420], [1900, 560, 1620, 300, 1750, 520], [1760, 667, 1600, 300, 1700, 560], [1600, 667, 1560, 300, 1600, 520],
].map(([ex, ey, c1x, c1y, c2x, c2y]) => `M${O[0]} ${O[1]} C${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`);
const UP = [`M${A[0]} ${A[1]} C1380 150, 1320 80, 1230 0`, `M${A[0]} ${A[1]} C1400 140, 1360 60, 1300 0`, `M${B[0]} ${B[1]} C1380 450, 1300 560, 1200 667`, `M${B[0]} ${B[1]} C1400 470, 1360 600, 1320 667`];

const Packet = ({ d, dur, begin, r = 3.5, c = "#ffffff" }) => (
  <circle r={r} fill={c} opacity="0">
    <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.4 0 0.3 1" />
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.9;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
  </circle>
);

export const HeroFlowMotion = ({ className = "" }) => (
  <div className={`relative aspect-[3/1] ${className}`} data-testid="home-hero-flow-motion">
    <motion.img src="/images/home-hero-flow.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full" animate={{ y: [0, -6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} data-testid="home-hero-flow" />
    <svg viewBox="0 0 2000 667" className="absolute inset-0 w-full h-full" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="hfGlow"><stop offset="0%" stopColor="#f2a91c" stopOpacity="0.85" /><stop offset="100%" stopColor="#f2a91c" stopOpacity="0" /></radialGradient>
        <radialGradient id="hfNode"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" /><stop offset="100%" stopColor="#bfd8ff" stopOpacity="0" /></radialGradient>
        <filter id="hfBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      {LEFT.map((d, i) => <path key={i} d={d} stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.2" strokeDasharray="6 26" className="pm-wire" style={{ animationDelay: `${i * -0.4}s` }} />)}
      {LEFT.map((d, i) => <Packet key={`l${i}`} d={d} dur={3.2} begin={i * 0.5} r={3} />)}
      {RIGHT.map((d, i) => <Packet key={`r${i}`} d={d} dur={3.6 + (i % 3) * 0.6} begin={0.8 + i * 0.35} r={i % 2 ? 3.5 : 2.5} c={i % 4 === 0 ? "#f7c65c" : "#ffffff"} />)}
      {UP.map((d, i) => <Packet key={`u${i}`} d={d} dur={4} begin={1.5 + i * 0.7} r={2.5} />)}
      {[A, B].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="34" fill="url(#hfNode)" opacity="0.6" className="pm-breathe" style={{ animationDelay: `${i * 0.8}s` }} />
          <circle cx={x} cy={y} r="26" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" className="pm-ring" style={{ animationDelay: `${i * 0.8}s` }} />
        </g>
      ))}
      <circle cx={O[0]} cy={O[1]} r="56" fill="url(#hfGlow)" opacity="0.7" className="pm-breathe" />
      <circle cx={O[0]} cy={O[1]} r="34" fill="none" stroke="#f2a91c" strokeOpacity="0.8" strokeWidth="2" className="pm-ring" />
      <circle cx={O[0]} cy={O[1]} r="34" fill="none" stroke="#f2a91c" strokeOpacity="0.8" strokeWidth="2" className="pm-ring" style={{ animationDelay: "1s" }} />
      <circle cx={O[0]} cy={O[1]} r="10" fill="#ffd27a" filter="url(#hfBlur)" className="pm-blink" />
    </svg>
  </div>
);
