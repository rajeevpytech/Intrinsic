import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { Logo } from "./common";
import { nav } from "../mock/mock";

const byLabel = (label) => nav.find((n) => n.label === label);
const short = (s) => s.split(" – ")[0];

const COLUMNS = [
  [{ title: "AI", to: byLabel("AI").to, links: byLabel("AI").items },
   { title: "Cloud", to: byLabel("Cloud").to, links: byLabel("Cloud").items }],
  [{ title: "Cybersecurity", to: byLabel("Cybersecurity").to, links: byLabel("Cybersecurity").items }],
  [{ title: "Managed IT", to: byLabel("Managed IT").to, links: byLabel("Managed IT").items }],
  [{ title: "Industries", to: byLabel("Industries").to, links: byLabel("Industries").items }],
  [{ title: "Governance", to: byLabel("Governance").to, links: [] },
   { title: "Company", to: "/about", links: [
     { label: "About", to: "/about" }, { label: "Resources", to: "/resources" }, { label: "Careers", to: "/careers" }, { label: "Contact", to: "/contact" },
   ] }],
];

const FooterGroup = ({ g }) => (
  <div className="foot-group" data-testid={`footer-group-${g.title}`}>
    <Link to={g.to} className="foot-heading" data-testid={`footer-heading-${g.title}`}>
      <span>{g.title}</span>
      {g.links.length === 0 && <ArrowUpRight size={14} className="foot-heading-arrow" />}
    </Link>
    {g.links.length > 0 && (
      <ul className="foot-list">
        {g.links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="foot-link" data-testid={`footer-link-${l.to.replace(/\//g, "-").slice(1)}`}>
              <span>{short(l.label)}</span>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Footer = () => {
  const { pathname } = useLocation();
  return (
  <footer className="relative text-white footer-surface" data-testid="site-footer" data-type-tone="dark" style={{ "--type-header-mobile": 17, "--type-header-tablet": 18, "--type-header-desktop": 18, "--type-header-lineHeight": 1.3, "--type-header-ink": "#ffffff" }}>
    <div className="foot-grain" aria-hidden="true" />
    <div className="container-x relative">
      <div className="pt-14 pb-8 lg:pt-16 lg:pb-9">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-9 border-b border-white/12" data-testid="footer-brand">
          <div>
            <Link to="/" className="inline-flex" data-testid="footer-logo"><Logo color="#ffffff" size={36} /></Link>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/company/intrinsic-tech-group" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="foot-social" data-testid="footer-linkedin"><Linkedin size={15} /></a>
            {pathname !== "/contact" && <a href="https://www.instagram.com/intrinsictechnologygroup/" target="_blank" rel="noreferrer" aria-label="Instagram" className="foot-social" data-testid="footer-instagram"><Instagram size={15} /></a>}
          </div>
        </div>
        <div className="foot-grid pt-9 lg:pt-10" data-testid="footer-columns">
          {COLUMNS.map((groups, i) => (
            <div key={i} className="flex flex-col gap-7">
              {groups.map((g) => <FooterGroup key={g.title} g={g} />)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5 border-t border-white/15">
        <div className="flex items-center gap-6">
          <Link to="/privacy-policy" className="foot-legal" data-testid="footer-privacy">Privacy Policy</Link>
          <Link to="/terms-of-service" className="foot-legal" data-testid="footer-terms">Terms of Service</Link>
        </div>
        <p className="text-white/55 text-[12.5px]" data-testid="footer-copyright">&copy; {new Date().getFullYear()} Intrinsic. All rights reserved.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
