import React from "react";

/* Compliance hero graphic: a control board where controls get verified one by one, with framework badges */
const CONTROLS = ["Access Policy", "MFA Enforced", "Patching", "Backups Tested", "Log Retention", "Vendor Review", "Incident Plan", "Risk Register", "Asset Inventory", "Encryption", "Access Reviews", "Training"];
const FRAMEWORKS = ["HIPAA", "NYDFS 500", "SOC 2", "NIST CSF"];

export const ControlBoard = ({ className = "" }) => (
  <div className={`relative ${className}`} aria-hidden="true" data-testid="control-board">
    <div className="bg-white/70 backdrop-blur border border-white/80 shadow-[0_30px_60px_-30px_rgba(0,56,142,0.35)] p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-royal/80">Control status</p>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] font-bold text-royal"><span className="w-2 h-2 rounded-full bg-[#108474] animate-pulse" />Continuous verification</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {CONTROLS.map((c, i) => (
          <div key={c} className="cb-tile relative flex items-center gap-2 bg-white border border-powder px-2.5 py-2" style={{ animationDelay: `${i * 0.55}s` }}>
            <span className="cb-check relative w-4 h-4 shrink-0 rounded-full border border-powder" style={{ animationDelay: `${i * 0.55}s` }}>
              <svg viewBox="0 0 16 16" className="absolute inset-0"><path d="M4 8.5l2.6 2.5L12 5.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="text-[10.5px] lg:text-[11px] font-semibold text-midnight truncate">{c}</span>
          </div>
        ))}
      </div>
      <div className="h-1 bg-powder mt-5 overflow-hidden"><span className="cb-bar block h-full bg-royal" /></div>
    </div>
    <div className="absolute -bottom-5 -left-4 lg:-left-8 flex flex-wrap gap-2">
      {FRAMEWORKS.map((f, i) => (
        <span key={f} className="ind-tile bg-midnight text-white text-[10.5px] font-bold tracking-[0.14em] uppercase px-3 py-2 shadow-lg" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>{f}</span>
      ))}
    </div>
  </div>
);
