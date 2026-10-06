import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "./common";
import { nav } from "../mock/mock";
import SiteSearch from "./SiteSearch";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [mobileSub, setMobileSub] = useState(null);
  const [alignRight, setAlignRight] = useState(false);

  const openMenu = (e, label) => {
    const r = e.currentTarget.getBoundingClientRect();
    const z = parseFloat(getComputedStyle(document.body).zoom) || 1;
    setAlignRight(r.left + 760 * z > window.innerWidth);
    setActive(label);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasMenu = (n) => (n.items && n.items.length > 0) || (n.groups && n.groups.length > 0);
  const primary = nav;

  const renderMegaItem = (it) => (
    <Link key={it.label} to={it.to} className="mega-item group" data-testid={`nav-item-${it.label}`}>
      <div className="flex-1 min-w-0">
        <span className="mega-item-title">{it.label}</span>
        {it.desc && <span className="mega-item-desc">{it.desc}</span>}
      </div>
      <ArrowUpRight size={16} className="mega-item-arrow" />
    </Link>
  );

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_-8px_rgba(8,76,152,0.25)]" : "bg-white"
      }`}
    >
      <div className="container-x nav-container">
        {/* Mobile / tablet bar */}
        <div className="flex xl:hidden items-center justify-between h-[68px]">
          <Link to="/" className="shrink-0" data-testid="nav-logo"><Logo size={30} /></Link>
          <div className="flex items-center gap-1">
            <SiteSearch />
            <button className="text-midnight" onClick={() => setOpen(!open)} aria-label="Menu" data-testid="mobile-menu-toggle">
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Desktop: logo spans both rows, utility row + primary row stacked on the right */}
        <div className="hidden xl:flex items-center justify-between h-[104px]">
          <Link to="/" className="shrink-0 flex items-center" data-testid="nav-logo"><Logo size={44} /></Link>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-6 h-[38px] mb-1" data-testid="nav-utility-row">
              <SiteSearch />
              <a href="#contact" className="nav-cta" data-testid="header-cta">
                Talk to an Expert
                <ArrowRight size={13} strokeWidth={2.4} className="nav-cta-arrow" />
              </a>
            </div>

            <nav className="flex items-center gap-8 whitespace-nowrap h-[46px]" data-testid="nav-primary-row">
              {primary.map((n) => (
                <div
                  key={n.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={(e) => openMenu(e, n.label)}
                  onMouseLeave={() => setActive(null)}
                >
                  {hasMenu(n) ? (
                    <Link
                      to={n.to || "#"}
                      onClick={(e) => { if (!n.to) e.preventDefault(); }}
                      className={`nav-link flex items-center gap-1 font-serif text-[15px] transition-colors ${active === n.label ? "text-navy" : "text-midnight hover:text-navy"}`}
                      data-testid={`nav-${n.label}`}
                    >
                      {n.label}
                      <ChevronDown size={13} strokeWidth={2} className={`mt-0.5 transition-transform duration-200 ${active === n.label ? "rotate-180 text-navy" : ""}`} />
                    </Link>
                  ) : (
                    <Link to={n.to || "#"} className="nav-link font-serif text-[15px] text-midnight hover:text-navy transition-colors" data-testid={`nav-${n.label}`}>
                      {n.label}
                    </Link>
                  )}

                  {hasMenu(n) && active === n.label && (
                    <div className={`absolute top-full pt-2 ${alignRight ? "right-0" : "left-0"}`}>
                      <div className={`mega-panel animate-fade-in ${n.groups ? "mega-panel--groups" : ""} ${!n.groups && n.items.length <= 3 ? "mega-panel--sm" : ""} ${alignRight ? "mega-panel--right" : ""}`}>
                        <div className="mega-caret" />
                        <p className="mega-eyebrow">{n.label}</p>
                        {n.groups ? (
                          <div className="mega-groups">
                            {n.groups.map((g) => (
                              <div key={g.heading} className="mega-group">
                                <p className="mega-group-heading">{g.heading}</p>
                                <div className="mega-group-items">
                                  {g.items.map(renderMegaItem)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mega-grid">
                            {n.items.map(renderMegaItem)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="xl:hidden bg-white border-t border-powder/60 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="container-x py-3 flex flex-col">
            {nav.map((n) => (
              <div key={n.label} className="border-b border-ice">
                {hasMenu(n) ? (
                  <>
                    <button
                      onClick={() => setMobileSub(mobileSub === n.label ? null : n.label)}
                      className="w-full flex items-center justify-between py-3.5 font-serif text-lg text-midnight"
                      data-testid={`mobile-nav-${n.label}`}
                    >
                      {n.label}
                      <ChevronDown
                        size={18}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${mobileSub === n.label ? "rotate-180 text-navy" : "text-slatesage"}`}
                      />
                    </button>
                    {mobileSub === n.label && (
                      <div className="pb-3 pl-3 flex flex-col animate-fade-in" data-testid={`mobile-submenu-${n.label}`}>
                        {n.groups ? (
                          n.groups.map((g) => (
                            <div key={g.heading} className="mb-1">
                              <p className="mobile-group-heading">{g.heading}</p>
                              {g.items.map((it) => (
                                <Link
                                  key={it.label}
                                  to={it.to}
                                  onClick={() => setOpen(false)}
                                  className="block py-2.5 text-[15px] text-slatesage hover:text-navy transition-colors"
                                >
                                  {it.label}
                                </Link>
                              ))}
                            </div>
                          ))
                        ) : (
                          n.items.map((it) => (
                            <Link
                              key={it.label}
                              to={it.to}
                              onClick={() => setOpen(false)}
                              className="py-2.5 text-[15px] text-slatesage hover:text-navy transition-colors"
                            >
                              {it.label}
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={n.to || "#"}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 font-serif text-lg text-midnight"
                  >
                    {n.label}
                  </Link>
                )}
              </div>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className="btn-amber mt-6 w-full justify-center" data-testid="mobile-cta">
              <span>Talk to an Expert</span>
              <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
