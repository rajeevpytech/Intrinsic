import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../lib/api";
import { SEO_ROUTE_MAP } from "./seoRoutes";
import { applyHead } from "./head";

const Ctx = createContext(null);

export const useSeoSettings = () => useContext(Ctx)?.settings || {};

// Detail pages (e.g. a case study) register their own meta; the global controller reads it.
export const usePageSeo = (opts) => {
  const ctx = useContext(Ctx);
  const path = useLocation().pathname;
  const key = JSON.stringify(opts || null);
  useEffect(() => {
    if (!ctx) return undefined;
    if (opts) ctx.setPageSeo({ ...opts, path });
    return () => ctx.setPageSeo((cur) => (cur && cur.path === path ? null : cur));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, path]);
};

export function SeoProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [pageSeo, setPageSeo] = useState(null);
  useEffect(() => {
    api.get("/seo").then(({ data }) => setSettings(data)).catch(() => setSettings({}));
  }, []);
  return <Ctx.Provider value={{ settings: settings || {}, pageSeo, setPageSeo }}>{children}</Ctx.Provider>;
}

const absBase = (s) => {
  const b = (s.canonical_base || "").trim().replace(/\/+$/, "");
  return b || (typeof window !== "undefined" ? window.location.origin : "");
};

const toAbs = (base, v) => (!v ? "" : v.startsWith("http") ? v : v.startsWith("/") ? base + v : v);

function orgJsonLd(s, base) {
  const o = s.organization || {};
  const ld = { "@context": "https://schema.org", "@type": "Organization", "@id": base + "/#organization", name: o.name || s.site_name, url: o.url || base };
  if (o.legal_name) ld.legalName = o.legal_name;
  if (o.logo) ld.logo = toAbs(base, o.logo);
  const sameAs = (o.same_as || []).filter(Boolean);
  if (sameAs.length) ld.sameAs = sameAs;
  if (o.email) ld.email = o.email;
  if (o.telephone) ld.telephone = o.telephone;
  if (o.city || o.street) ld.address = { "@type": "PostalAddress", streetAddress: o.street || undefined, addressLocality: o.city || undefined, addressRegion: o.region || undefined, postalCode: o.postal_code || undefined, addressCountry: o.country || undefined };
  return ld;
}

export function SeoController() {
  const ctx = useContext(Ctx);
  const { pathname } = useLocation();
  const settings = ctx ? ctx.settings : null;
  const pageSeo = ctx ? ctx.pageSeo : null;

  useEffect(() => {
    if (!settings) return;
    const base = absBase(settings);
    if (pathname.startsWith("/admin")) {
      applyHead({ title: `${settings.site_name || "Intrinsic Technology"} — Admin`, robots: "noindex, nofollow" });
      return;
    }
    const canonical = base + pathname;
    const tmpl = settings.title_template || "{title}";
    const routeDef = SEO_ROUTE_MAP[pathname] || null;
    const override = (settings.pages || {})[pathname] || {};
    const detail = pageSeo && pageSeo.path === pathname ? pageSeo : null;

    let title, description, keywords, image, robots, type = "website", extraLd = [];
    if (detail) {
      title = detail.title ? tmpl.replace("{title}", detail.title) : settings.default_title;
      description = detail.description || settings.default_description;
      keywords = detail.keywords || settings.default_keywords;
      image = detail.image || settings.default_og_image;
      robots = detail.robots || settings.robots_default;
      type = detail.type || "article";
      extraLd = detail.jsonLd || [];
    } else if (pathname === "/") {
      title = override.title ? tmpl.replace("{title}", override.title) : settings.default_title;
      description = override.description || settings.default_description;
      keywords = override.keywords || settings.default_keywords;
      image = override.og_image || settings.default_og_image;
      robots = override.robots || settings.robots_default;
    } else {
      const baseTitle = override.title || (routeDef && routeDef.title);
      title = baseTitle ? tmpl.replace("{title}", baseTitle) : settings.default_title;
      description = override.description || (routeDef && routeDef.description) || settings.default_description;
      keywords = override.keywords || settings.default_keywords;
      image = override.og_image || settings.default_og_image;
      robots = override.robots || settings.robots_default;
    }
    image = toAbs(base, image);

    const jsonLd = [orgJsonLd(settings, base)];
    if (pathname === "/") {
      jsonLd.push({ "@context": "https://schema.org", "@type": "WebSite", "@id": base + "/#website", name: settings.site_name, url: base });
      const faqs = ((settings.geo && settings.geo.faqs) || []).filter((f) => f.q && f.a);
      if (faqs.length) jsonLd.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
    } else {
      // Breadcrumb for every non-home page (SEO + GEO navigation context)
      const parts = pathname.split("/").filter(Boolean);
      const items = [{ "@type": "ListItem", position: 1, name: "Home", item: base + "/" }];
      let acc = "";
      parts.forEach((seg, i) => {
        acc += "/" + seg;
        const def = SEO_ROUTE_MAP[acc];
        const name = (def && def.label) || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        items.push({ "@type": "ListItem", position: i + 2, name, item: base + acc });
      });
      jsonLd.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items });
      // Service schema for service pages
      if (pathname.startsWith("/services/") && routeDef) {
        jsonLd.push({ "@context": "https://schema.org", "@type": "Service", name: routeDef.title, description: routeDef.description, serviceType: routeDef.title, provider: { "@id": base + "/#organization" }, areaServed: "US", url: canonical });
      }
    }
    (extraLd || []).forEach((l) => l && jsonLd.push(l));

    applyHead({ title, description, keywords, canonical, robots, image, type, siteName: settings.site_name, twitterHandle: settings.twitter_handle, verification: settings.google_site_verification, jsonLd });
  }, [pathname, settings, pageSeo]);

  return null;
}
