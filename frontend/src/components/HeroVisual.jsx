import React from "react";
import { ShieldCheck, Cloud, Server, Cpu, DatabaseBackup, Network } from "lucide-react";

// Custom animated hero visual: a protected core with the core services
// orbiting around it and live data flowing inward — communicating that
// Intrinsic monitors, manages and secures the whole technology environment.

const NODES = [
  { icon: Cloud, label: "Cloud", x: 220, y: 42, d: "0ms" },
  { icon: ShieldCheck, label: "Security", x: 378, y: 131, d: "120ms" },
  { icon: Cpu, label: "AI", x: 378, y: 309, d: "240ms" },
  { icon: DatabaseBackup, label: "Backup & DR", x: 220, y: 398, d: "360ms" },
  { icon: Network, label: "Network", x: 62, y: 309, d: "480ms" },
  { icon: Server, label: "Managed IT", x: 62, y: 131, d: "600ms" },
];

const HeroVisual = () => {
  return (
    <div className="hv-wrap" data-testid="hero-visual">
      {/* connectors + core rings (behind nodes) */}
      <svg viewBox="0 0 440 440" className="hv-svg" aria-hidden="true">
        {/* decorative orbit rings */}
        <circle cx="220" cy="220" r="178" className="hv-ring-dash" />
        <circle cx="220" cy="220" r="140" className="hv-ring-faint" />

        {/* data connectors from each node to the core */}
        {NODES.map((n, i) => (
          <line
            key={i}
            x1={n.x}
            y1={n.y}
            x2="220"
            y2="220"
            className="hv-flow"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}

        {/* radar pings from the core */}
        <circle cx="220" cy="220" r="46" className="hv-ping" />
        <circle cx="220" cy="220" r="46" className="hv-ping" style={{ animationDelay: "1.4s" }} />
        <circle cx="220" cy="220" r="46" className="hv-ping" style={{ animationDelay: "2.8s" }} />
      </svg>

      {/* central protected core — Intrinsic brand mark */}
      <div className="hv-core" data-testid="hero-visual-core">
        <img src="/favicon.svg" alt="Intrinsic" className="hv-core-logo" />
      </div>

      {/* service nodes */}
      {NODES.map((n, i) => {
        const Icon = n.icon;
        return (
          <div
            key={i}
            className="hv-node"
            style={{ left: `${(n.x / 440) * 100}%`, top: `${(n.y / 440) * 100}%`, animationDelay: n.d }}
            data-testid={`hero-node-${n.label.toLowerCase().replace(/[^a-z]/g, "-")}`}
          >
            <span className="hv-node-icon"><Icon size={20} strokeWidth={1.9} /></span>
            <span className="hv-node-label">{n.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default HeroVisual;
