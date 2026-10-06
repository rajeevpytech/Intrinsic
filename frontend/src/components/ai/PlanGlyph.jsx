import React from "react";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export const PlanGlyph = ({ kind, className = "" }) => (
  <svg viewBox="0 0 48 48" className={`w-11 h-11 ${className}`} aria-hidden="true" data-testid={`plan-glyph-${kind}`}>
    {kind === "ready" && <g {...S}>
      <circle cx="24" cy="24" r="17" strokeOpacity="0.35" className="pm-breathe" />
      <path d="M15 24 l6 6 l12 -13" strokeWidth="2.6" strokeDasharray="40" strokeDashoffset="40"><animate attributeName="stroke-dashoffset" values="40;0;0;40" keyTimes="0;0.3;0.8;1" dur="3.4s" repeatCount="indefinite" /></path>
    </g>}
    {kind === "prepare" && <g {...S}>
      <g><animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="10s" repeatCount="indefinite" />
        <path d="M24 8 l3 4 h5 l1 5 l4 3 l-1 5 l1 5 l-4 3 l-1 5 h-5 l-3 4 l-3 -4 h-5 l-1 -5 l-4 -3 l1 -5 l-1 -5 l4 -3 l1 -5 h5 z" />
      </g>
      <circle cx="24" cy="24" r="5" />
    </g>}
    {kind === "address" && <g {...S}>
      <path d="M24 8 L42 40 H6 Z" />
      <line x1="24" y1="19" x2="24" y2="29" strokeWidth="2.6" className="pm-blink" />
      <circle cx="24" cy="34.5" r="1.4" fill="currentColor" className="pm-blink" />
    </g>}
    {kind === "decide" && <g {...S}>
      <path d="M8 24 H20" /><path d="M20 24 C26 24 26 12 32 12 H40" /><path d="M20 24 C26 24 26 36 32 36 H40" />
      <circle r="2.6" fill="currentColor" stroke="none"><animateMotion dur="2.4s" repeatCount="indefinite" path="M8 24 H20 C26 24 26 12 32 12 H40" /></circle>
      <circle r="2.6" fill="currentColor" stroke="none"><animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M8 24 H20 C26 24 26 36 32 36 H40" /></circle>
    </g>}
  </svg>
);
