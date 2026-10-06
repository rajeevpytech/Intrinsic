import React, { useEffect } from "react";
import { X, ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { ReportingDashboard } from "./monitoring/MonitoringGraphics";

const INCLUDES = [
  "Executive summary with current exposure and priority findings",
  "Remediation status and progress over the reporting period",
  "Risk trend analysis with 90-day movement",
  "Technical detail for IT and security teams",
  "Framework alignment: HIPAA · NYDFS Part 500 · SOC 2 · NIST CSF",
];

const SampleReportModal = ({ open, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sr-overlay" onMouseDown={onClose} data-testid="sample-report-modal">
      <div className="sr-card" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="sr-close" onClick={onClose} aria-label="Close" data-testid="sample-report-close"><X size={18} /></button>
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-5 p-8 lg:p-10 bg-royal text-white relative overflow-hidden hero-grain">
            <span className="absolute -bottom-20 -left-10 w-[280px] h-[280px] rounded-full bg-royal/40 blur-3xl" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-amber"><FileText size={15} /> Sample Report</span>
              <h3 className="font-serif font-semibold text-[26px] leading-[1.15] mt-4">A preview of your monthly security report</h3>
              <p className="text-white/75 text-[14.5px] leading-[1.65] mt-4">Illustrative data. Your report reflects your own environment, findings, and remediation activity.</p>
              <ul className="mt-7 space-y-3">
                {INCLUDES.map((i) => (
                  <li key={i} className="flex gap-3 text-white/85 text-[13.5px] leading-[1.5]"><CheckCircle2 size={17} className="text-amber shrink-0 mt-0.5" />{i}</li>
                ))}
              </ul>
              <a href="#contact" onClick={onClose} className="btn-amber mt-8" data-testid="sample-report-cta"><span>Request the Full Report</span><span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span></a>
            </div>
          </div>
          <div className="lg:col-span-7 p-6 lg:p-9 bg-ice flex items-center">
            <ReportingDashboard
              tabs={["Overview", "Detections", "Trends", "Compliance"]}
              bigStat="124"
              bigLabel="Priority findings"
              statusRows={[{ label: "Remediated", value: 72, pct: 90, color: "#108474" }, { label: "In Progress", value: 38, pct: 50, color: "#1b61be" }, { label: "Open", value: 14, pct: 22, color: "#faaf6a" }]}
              trendPct="-42%"
              trendLabel="Reduction in open findings (last 90 days)"
              extraStat={{ value: "14", label: "Items requiring attention" }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleReportModal;
