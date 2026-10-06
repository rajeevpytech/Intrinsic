import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePageSeo } from "../lib/SeoContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/services/managed-it", label: "Managed IT" },
  { to: "/services/cybersecurity", label: "Cybersecurity" },
  { to: "/services/cloud", label: "Cloud" },
  { to: "/industries", label: "Industries" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
];

export default function NotFound() {
  usePageSeo({
    title: "Page Not Found (404)",
    description: "The page you are looking for could not be found. Explore Intrinsic Technology's managed IT, cybersecurity, cloud, and AI services.",
    robots: "noindex, follow",
  });
  return (
    <div className="bg-white page-in min-h-screen" data-testid="not-found-page">
      <Navbar />
      <main className="pt-[var(--nav-h)]">
        <section className="container-x py-24 lg:py-32 text-center" data-testid="not-found-hero">
          <p className="text-amber font-semibold tracking-[0.2em] text-sm uppercase">Error 404</p>
          <h1 className="font-serif font-semibold text-[40px] sm:text-[56px] leading-[1.05] text-royal mt-4" data-testid="not-found-title">
            This page could not be found
          </h1>
          <p className="text-slatesage text-[17px] leading-[1.6] mt-6 max-w-[640px] mx-auto">
            The link may be broken or the page may have moved. Here are some helpful places to continue.
          </p>
          <nav className="mt-10 flex flex-wrap justify-center gap-3" aria-label="Helpful links">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="btn-amber" data-testid={`not-found-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>
        </section>
      </main>
      <Footer />
    </div>
  );
}
