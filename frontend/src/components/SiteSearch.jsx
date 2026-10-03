import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { nav } from "../mock/mock";

const STATIC = [
  { label: "Home", to: "/", group: "Pages" },
  { label: "About Us", to: "/about", group: "Pages" },
  { label: "Careers", to: "/careers", group: "Pages" },
  { label: "Resources", to: "/resources", group: "Pages" },
  { label: "Contact", to: "/contact", group: "Pages" },
];

function buildIndex() {
  const out = [];
  const seen = new Set();
  const add = (label, to, group) => {
    if (!to || seen.has(to)) return;
    seen.add(to);
    out.push({ label, to, group });
  };
  nav.forEach((n) => {
    if (n.to) add(n.label, n.to, n.items.length ? n.label : "Services");
    n.items.forEach((it) => add(it.label, it.to, n.label));
  });
  STATIC.forEach((s) => add(s.label, s.to, s.group));
  return out;
}

const SiteSearch = ({ label }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return index.slice(0, 8);
    return index.filter((p) => p.label.toLowerCase().includes(term) || p.group.toLowerCase().includes(term)).slice(0, 10);
  }, [q, index]);

  useEffect(() => { setActive(0); }, [q]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.key === "/" && ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ(""); setActive(0);
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  const go = (to) => { setOpen(false); navigate(to); };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active].to); }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        data-testid="site-search-trigger"
        className={label
          ? "nav-util inline-flex items-center gap-1.5"
          : "inline-flex items-center justify-center w-9 h-9 rounded-full text-midnight hover:bg-ice hover:text-navy transition-colors"}
      >
        <Search size={label ? 16 : 19} strokeWidth={2.2} />
        {label && <span>{label}</span>}
      </button>

      {open && (
        <div className="ss-overlay" onMouseDown={() => setOpen(false)} data-testid="site-search-modal">
          <div className="ss-panel" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="ss-head">
              <Search size={18} className="text-slatesage shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search services, industries, pages…"
                className="ss-input"
                data-testid="site-search-input"
              />
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-slatesage hover:text-royal transition-colors"><X size={18} /></button>
            </div>
            <div className="ss-results" data-testid="site-search-results">
              {results.length === 0 ? (
                <p className="ss-empty">No pages match "{q}". Try "cloud", "security" or an industry.</p>
              ) : (
                results.map((r, i) => (
                  <button
                    key={r.to}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.to)}
                    className={`ss-item ${i === active ? "ss-item-active" : ""}`}
                    data-testid={`site-search-result-${i}`}
                  >
                    <div className="flex flex-col text-left">
                      <span className="ss-item-label">{r.label}</span>
                      <span className="ss-item-group">{r.group}</span>
                    </div>
                    <ArrowRight size={16} className="ss-item-arrow" />
                  </button>
                ))
              )}
            </div>
            <div className="ss-foot">
              <span className="inline-flex items-center gap-1.5"><CornerDownLeft size={13} /> to open</span>
              <span>↑ ↓ to navigate · Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SiteSearch;
