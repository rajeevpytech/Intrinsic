import React from "react";

/* Managed IT hero graphic: five stacked layers of the environment with a scanning beam and health indicators */
const LAYERS = ["Applications", "Cloud Platforms", "Networks", "Endpoints", "Users"];

export const StackGraphic = ({ className = "" }) => (
  <svg viewBox="0 0 560 480" className={className} aria-hidden="true" data-testid="stack-graphic">
    <defs>
      <linearGradient id="stack-plane" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" /><stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" /></linearGradient>
      <linearGradient id="stack-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#faaf6a" stopOpacity="0" /><stop offset="50%" stopColor="#faaf6a" stopOpacity="0.9" /><stop offset="100%" stopColor="#faaf6a" stopOpacity="0" /></linearGradient>
    </defs>
    {LAYERS.map((l, i) => {
      const y = 70 + i * 74;
      return (
        <g key={l} className="stack-layer" style={{ animationDelay: `${i * 0.14}s` }}>
          <polygon points={`140,${y} 420,${y} 480,${y + 44} 200,${y + 44}`} fill="url(#stack-plane)" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1.2" />
          <text x="128" y={y + 28} textAnchor="end" className="perim-label" fill="#ffffff" fillOpacity="0.85">{l.toUpperCase()}</text>
          {[0, 1, 2].map((k) => <circle key={k} cx={250 + k * 60} cy={y + 22} r="4" fill="#faaf6a" className="stack-dot" style={{ animationDelay: `${(i * 3 + k) * 0.35}s` }} />)}
        </g>
      );
    })}
    <rect x="130" y="60" width="360" height="6" fill="url(#stack-beam)" className="stack-beam" />
    <line x1="140" y1="70" x2="140" y2="410" stroke="#ffffff" strokeOpacity="0.2" />
    <line x1="480" y1="114" x2="480" y2="454" stroke="#ffffff" strokeOpacity="0.2" />
  </svg>
);
