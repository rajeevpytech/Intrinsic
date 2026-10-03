import React from "react";
import { motion } from "framer-motion";
import { C } from "./AiGraphics";

/* Stages pipeline: line + nodes load in left->right once, with a single travelling dot */
export const StagesMotion = ({ stages = ["Assess", "Prepare", "Implement", "Manage"], className = "", ink = C.navy, light = false }) => {
  const n = stages.length, pad = 60, W = 640, y = 60;
  const xs = stages.map((_, i) => pad + (i * (W - pad * 2)) / (n - 1));
  const path = `M${xs[0]} ${y} L${xs[n - 1]} ${y}`;
  const stroke = light ? "#ffffff" : ink;
  const drawDur = 1.2;
  return (
    <svg viewBox={`0 0 ${W} 120`} className={className} aria-hidden="true" data-testid="stages-motion">
      <motion.path d={path} fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="1.8"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: drawDur, ease: "easeInOut" }} />
      {stages.map((s, i) => (
        <motion.g key={s}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: drawDur * (i / (n - 1)) }}>
          <circle cx={xs[i]} cy={y} r="17" fill={light ? "#ffffff" : C.ice} fillOpacity={light ? 0.12 : 1} stroke={stroke} strokeOpacity="0.55" strokeWidth="1.5" />
          <circle cx={xs[i]} cy={y} r="5" fill={i === n - 1 ? C.gold : light ? "#ffffff" : C.royal} />
          <text x={xs[i]} y={y + 40} textAnchor="middle" className="perim-label" fill={stroke} fillOpacity="0.9" style={{ fontSize: 9.5, letterSpacing: "1.8px" }}>{s.toUpperCase()}</text>
        </motion.g>
      ))}
      <circle r="2.5" fill={C.gold} opacity="0">
        <animateMotion dur="7s" begin={`${drawDur}s`} repeatCount="indefinite" path={path} />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="7s" begin={`${drawDur}s`} repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

/* Layers: stacked environment bands (identity, data, apps…) that breathe and light up in sequence */
export const LayersMotion = ({ layers = ["Identity & Access", "Data & Information", "Applications", "Integrations", "Security", "Governance"], className = "", light = true }) => {
  const stroke = light ? "#ffffff" : C.navy;
  return (
    <svg viewBox="0 0 360 300" className={className} aria-hidden="true" data-testid="layers-motion">
      {layers.map((l, i) => {
        const y = 22 + i * 44, w = 250 - i * 14, x = 40 + i * 7;
        return (
          <g key={l}>
            <motion.rect x={x} y={y} width={w} height="28" rx="3" fill={stroke} fillOpacity={0.1} stroke={stroke} strokeOpacity="0.45" strokeWidth="1.2"
              animate={{ fillOpacity: [0.08, 0.26, 0.08] }} transition={{ duration: 4.8, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }} />
            <motion.rect x={x + w - 6} y={y + 6} width="3" height="16" fill={C.gold} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 4.8, repeat: Infinity, delay: i * 0.5 }} />
            <text x={x + 14} y={y + 18} className="perim-label" fill={stroke} fillOpacity="0.92" style={{ fontSize: 9, letterSpacing: "1.6px" }}>{l.toUpperCase()}</text>
          </g>
        );
      })}
      <line x1="330" y1="10" x2="330" y2="290" stroke={stroke} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 7" className="pm-wire" />
      <motion.circle cx="330" r="5" fill={C.gold} initial={{ cy: 20 }} animate={{ cy: [20, 280, 20] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
    </svg>
  );
};
