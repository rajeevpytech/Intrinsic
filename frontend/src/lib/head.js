// Imperative <head> manager — guarantees no duplicate SEO tags and updates on route change.
const MANAGED = "data-seo-managed";

const upsertMeta = (attr, key, content) => {
  if (!content) return;
  const el = document.createElement("meta");
  el.setAttribute(attr, key);
  el.setAttribute("content", content);
  el.setAttribute(MANAGED, "1");
  document.head.appendChild(el);
};

export function applyHead({ title, description, keywords, canonical, robots, image, type = "website", siteName, twitterHandle, verification, jsonLd = [] }) {
  // Clear previously managed tags + any static defaults from index.html so we never duplicate.
  document.head.querySelectorAll(`[${MANAGED}]`).forEach((n) => n.remove());
  document.head
    .querySelectorAll(
      'link[rel="canonical"], meta[name="description"], meta[name="keywords"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"]'
    )
    .forEach((n) => n.remove());

  if (title) document.title = title;

  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", keywords);
  upsertMeta("name", "robots", robots);
  if (verification) upsertMeta("name", "google-site-verification", verification);

  // Canonical link
  if (canonical) {
    const link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", canonical);
    link.setAttribute(MANAGED, "1");
    document.head.appendChild(link);
  }

  // Open Graph
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:site_name", siteName);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:image", image);

  // Twitter
  upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", image);
  if (twitterHandle) upsertMeta("name", "twitter:site", twitterHandle);

  // JSON-LD structured data (SEO + GEO)
  (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean).forEach((obj) => {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute(MANAGED, "1");
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  });
}
