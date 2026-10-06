import React from "react";
import { motion } from "framer-motion";

const NAVY = "#0b4bc4", PALE = "#dde8f8", LIGHT = "#8fb7f0", MID = "#5b92e0", ORANGE = "#f6a94a";
const X0 = 755, X1 = 1142, BH = 40;
const ROWS = [
  { l: "Overall Readiness", y: 503, segs: [[X0, 1035, NAVY]] },
  { l: "Readiness by Area", y: 605, segs: [[X0, 830, LIGHT], [833, 908, "#a3c3f3"], [912, 1006, MID], [1010, 1070, NAVY]] },
  { l: "Priority Considerations", y: 713, segs: [[X0, 975, ORANGE]] },
  { l: "Recommended Actions", y: 821, segs: [[X0, 975, LIGHT]] },
];
const ease = [0.16, 1, 0.3, 1];

export const LiveReportMotion = () => (
  <svg viewBox="0 0 1536 1024" className="w-full h-auto" aria-hidden="true" data-testid="live-report-motion">
    <defs><filter id="lrShadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#0b2a66" floodOpacity="0.18" /></filter></defs>
    <motion.g animate={{ x: [0, 7, 0], y: [0, -6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}><rect x="515" y="68" width="830" height="722" fill={NAVY} /></motion.g>
    <motion.g animate={{ x: [0, -6, 0], y: [0, 6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
      <rect x="452" y="138" width="828" height="710" fill="#4a86e0" />
      <rect x="515" y="138" width="765" height="80" fill="#5b92e0" fillOpacity="0.5" />
    </motion.g>
    <motion.g animate={{ x: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}><rect x="190" y="240" width="92" height="608" fill={LIGHT} /></motion.g>
    <rect x="280" y="218" width="928" height="710" fill="#ffffff" filter="url(#lrShadow)" />
    <text x="345" y="362" fill={NAVY} style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", fontSize: 54, fontWeight: 700, letterSpacing: "-1px" }}>AI Readiness Assessment</text>
    <motion.rect x="345" y="402" height="6" fill={ORANGE} initial={{ width: 0 }} animate={{ width: 100 }} transition={{ duration: 0.8, delay: 0.3, ease }} />
    {ROWS.map((r, i) => (
      <g key={r.l} data-testid={`live-report-row-${i}`}>
        <text x="345" y={r.y + 12} fill="#1748b8" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", fontSize: 31, fontWeight: 500 }}>{r.l}</text>
        <rect x={X0} y={r.y - BH / 2} width={X1 - X0} height={BH} fill={PALE} />
        {r.segs.map(([a, b, c], k) => (
          <motion.rect key={k} x={a} y={r.y - BH / 2} height={BH} fill={c} initial={{ width: 0 }} animate={{ width: b - a }} transition={{ duration: 1.1, delay: 0.5 + i * 0.18 + k * 0.12, ease }} className={c === ORANGE ? "pm-blink" : ""} />
        ))}
      </g>
    ))}
  </svg>
);
