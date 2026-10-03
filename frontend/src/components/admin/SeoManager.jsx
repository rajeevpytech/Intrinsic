import React, { useEffect, useRef, useState } from "react";
import { Save, Upload, Plus, Trash2, Globe, Building2, Bot, FileCode2 } from "lucide-react";
import { api, imgUrl, errMsg, BACKEND } from "../../lib/api";
import { SEO_ROUTES } from "../../lib/seoRoutes";

const Input = ({ label, value, onChange, testId, placeholder, type = "text" }) => (
  <div>
    <label className="block text-[12px] font-semibold text-slatesage mb-1">{label}</label>
    <input type={type} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid={testId} />
  </div>
);

const Area = ({ label, value, onChange, testId, rows = 3, placeholder }) => (
  <div>
    <label className="block text-[12px] font-semibold text-slatesage mb-1">{label}</label>
    <textarea rows={rows} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid={testId} />
  </div>
);

const ImageField = ({ label, value, onChange, testId }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const doUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.path);
    } catch (err) { alert(errMsg(err)); } finally { setUploading(false); }
  };
  return (
    <div>
      <label className="block text-[12px] font-semibold text-slatesage mb-1">{label}</label>
      {value && <img src={imgUrl(value)} alt="" className="w-40 h-24 object-cover mb-2 border border-powder" />}
      <div className="flex gap-2">
        <label className="btn-outline cursor-pointer inline-flex" data-testid={`${testId}-upload`}>
          <span className="btn-arrow"><Upload size={14} /></span>
          <span>{uploading ? "Uploading..." : "Upload"}</span>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={doUpload} data-testid={testId} />
        </label>
        {value && <button type="button" className="btn-outline" onClick={() => onChange("")} data-testid={`${testId}-clear`}><span>Remove</span></button>}
      </div>
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, desc, children }) => (
  <div className="bg-white border border-powder p-5 mb-5">
    <div className="flex items-start gap-3 mb-4">
      <span className="inline-flex h-9 w-9 items-center justify-center bg-navy/10 text-navy rounded"><Icon size={18} /></span>
      <div><h3 className="font-serif text-[18px] text-midnight font-semibold">{title}</h3>{desc && <p className="text-slatesage text-[13px]">{desc}</p>}</div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function SeoManager() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/seo").then(({ data }) => setS(data)).catch((e) => alert(errMsg(e))); }, []);

  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const setOrg = (k, v) => setS((p) => ({ ...p, organization: { ...(p.organization || {}), [k]: v } }));
  const setGeo = (k, v) => setS((p) => ({ ...p, geo: { ...(p.geo || {}), [k]: v } }));
  const setPage = (path, k, v) => setS((p) => ({ ...p, pages: { ...(p.pages || {}), [path]: { ...((p.pages || {})[path] || {}), [k]: v } } }));

  const addFaq = () => setGeo("faqs", [...((s.geo && s.geo.faqs) || []), { q: "", a: "" }]);
  const setFaq = (i, k, v) => setGeo("faqs", ((s.geo && s.geo.faqs) || []).map((f, idx) => (idx === i ? { ...f, [k]: v } : f)));
  const delFaq = (i) => setGeo("faqs", ((s.geo && s.geo.faqs) || []).filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      const { data } = await api.put("/seo", s);
      setS(data);
      setMsg({ ok: true, text: "SEO & GEO settings saved" });
    } catch (e) { setMsg({ ok: false, text: errMsg(e) }); } finally { setSaving(false); }
  };

  if (!s) return <p className="text-slatesage">Loading…</p>;
  const geo = s.geo || {};
  const org = s.organization || {};
  const pages = s.pages || {};

  return (
    <div data-testid="editor-seo" className="max-w-[860px]">
      <h2 className="font-serif text-[26px] text-midnight font-semibold mb-2">SEO &amp; GEO Management</h2>
      <p className="text-slatesage text-[14px] mb-6">Control how the whole website appears in search engines and AI answer engines (ChatGPT, Perplexity, Google AI). Set site-wide defaults, your organization details, GEO content, and per-page overrides. Each blog, case study, service brief and job also has its own SEO &amp; GEO fields in its editor.</p>

      <SectionCard icon={Globe} title="Site-wide defaults" desc="Used on every page unless overridden below or on a specific content item.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Site name" value={s.site_name} onChange={(v) => set("site_name", v)} testId="seo-site-name" />
          <Input label="Title template ({title} is replaced by the page title)" value={s.title_template} onChange={(v) => set("title_template", v)} testId="seo-title-template" placeholder="{title} | Intrinsic Technology" />
        </div>
        <Input label="Default homepage title" value={s.default_title} onChange={(v) => set("default_title", v)} testId="seo-default-title" />
        <Area label="Default meta description" value={s.default_description} onChange={(v) => set("default_description", v)} testId="seo-default-description" />
        <Input label="Default keywords (comma separated)" value={s.default_keywords} onChange={(v) => set("default_keywords", v)} testId="seo-default-keywords" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Canonical base URL (optional — blank uses the live domain)" value={s.canonical_base} onChange={(v) => set("canonical_base", v)} testId="seo-canonical-base" placeholder="https://www.intrinsicamerica.com" />
          <Input label="Default robots directive" value={s.robots_default} onChange={(v) => set("robots_default", v)} testId="seo-robots-default" placeholder="index, follow" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Twitter / X handle (e.g. @intrinsic)" value={s.twitter_handle} onChange={(v) => set("twitter_handle", v)} testId="seo-twitter-handle" />
          <Input label="Google site verification token" value={s.google_site_verification} onChange={(v) => set("google_site_verification", v)} testId="seo-google-verification" />
        </div>
        <ImageField label="Default social share image (Open Graph)" value={s.default_og_image} onChange={(v) => set("default_og_image", v)} testId="seo-default-og" />
      </SectionCard>

      <SectionCard icon={Building2} title="Organization (knowledge graph)" desc="Powers the Organization structured data that search & AI engines use to understand your company.">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Name" value={org.name} onChange={(v) => setOrg("name", v)} testId="seo-org-name" />
          <Input label="Legal name" value={org.legal_name} onChange={(v) => setOrg("legal_name", v)} testId="seo-org-legal" />
          <Input label="Website URL" value={org.url} onChange={(v) => setOrg("url", v)} testId="seo-org-url" />
          <Input label="Contact email" value={org.email} onChange={(v) => setOrg("email", v)} testId="seo-org-email" />
          <Input label="Telephone" value={org.telephone} onChange={(v) => setOrg("telephone", v)} testId="seo-org-phone" />
        </div>
        <ImageField label="Logo" value={org.logo} onChange={(v) => setOrg("logo", v)} testId="seo-org-logo" />
        <Area label="Social profile URLs (sameAs — one per line)" rows={3}
          value={(org.same_as || []).join("\n")}
          onChange={(v) => setOrg("same_as", v.split("\n").map((x) => x.trim()).filter(Boolean))}
          testId="seo-org-sameas" placeholder={"https://www.linkedin.com/company/intrinsic-tech-group"} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Street" value={org.street} onChange={(v) => setOrg("street", v)} testId="seo-org-street" />
          <Input label="City" value={org.city} onChange={(v) => setOrg("city", v)} testId="seo-org-city" />
          <Input label="Region / State" value={org.region} onChange={(v) => setOrg("region", v)} testId="seo-org-region" />
          <Input label="Postal code" value={org.postal_code} onChange={(v) => setOrg("postal_code", v)} testId="seo-org-postal" />
          <Input label="Country" value={org.country} onChange={(v) => setOrg("country", v)} testId="seo-org-country" />
        </div>
      </SectionCard>

      <SectionCard icon={Bot} title="GEO — Generative Engine Optimization" desc="Help AI answer engines summarize and cite your site accurately.">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={geo.enabled !== false} onChange={(e) => setGeo("enabled", e.target.checked)} className="h-4 w-4 accent-[#0b3d91]" data-testid="seo-geo-enabled" />
          <span className="text-[13px] font-semibold text-midnight">Publish an AI discovery file at /api/llms.txt</span>
        </label>
        <Area label="Site summary (a concise, factual description AI engines can quote)" rows={4} value={geo.site_summary} onChange={(v) => setGeo("site_summary", v)} testId="seo-geo-summary" />
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[12px] font-semibold text-slatesage">Frequently asked questions (adds FAQ structured data on the homepage)</label>
            <button type="button" onClick={addFaq} className="btn-outline" data-testid="seo-faq-add"><span className="btn-arrow"><Plus size={14} /></span><span>Add FAQ</span></button>
          </div>
          <div className="space-y-3">
            {((geo.faqs) || []).map((f, i) => (
              <div key={i} className="border border-powder p-3 space-y-2" data-testid={`seo-faq-${i}`}>
                <Input label="Question" value={f.q} onChange={(v) => setFaq(i, "q", v)} testId={`seo-faq-q-${i}`} />
                <Area label="Answer" rows={2} value={f.a} onChange={(v) => setFaq(i, "a", v)} testId={`seo-faq-a-${i}`} />
                <button type="button" onClick={() => delFaq(i)} className="btn-outline" data-testid={`seo-faq-del-${i}`}><span className="btn-arrow"><Trash2 size={14} /></span><span>Remove</span></button>
              </div>
            ))}
            {(!geo.faqs || geo.faqs.length === 0) && <p className="text-slatesage text-[13px]">No FAQs yet.</p>}
          </div>
        </div>
        <Area label="Custom llms.txt (optional — leave blank to auto-generate from the summary, pages and FAQs)" rows={4} value={geo.llms_txt} onChange={(v) => setGeo("llms_txt", v)} testId="seo-geo-llmstxt" />
      </SectionCard>

      <SectionCard icon={FileCode2} title="Per-page overrides" desc="Fine-tune the title, description, keywords, share image and GEO summary for any page. Blank fields fall back to the defaults above.">
        <div className="space-y-2">
          {SEO_ROUTES.map((r) => {
            const pg = pages[r.path] || {};
            const touched = Object.values(pg).some((x) => (Array.isArray(x) ? x.length : (x || "").toString().trim()));
            return (
              <details key={r.path} className="border border-powder" data-testid={`seo-page-${r.path}`}>
                <summary className="cursor-pointer px-4 py-3 text-[13px] font-semibold text-midnight flex items-center justify-between">
                  <span>{r.label} <span className="text-slatesage font-normal">· {r.path}</span></span>
                  {touched && <span className="eyebrow text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700">customized</span>}
                </summary>
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-powder">
                  <Input label="Title" value={pg.title} onChange={(v) => setPage(r.path, "title", v)} testId={`seo-pg-title-${r.path}`} placeholder={r.title} />
                  <Area label="Meta description" rows={2} value={pg.description} onChange={(v) => setPage(r.path, "description", v)} testId={`seo-pg-desc-${r.path}`} placeholder={r.description} />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input label="Keywords" value={pg.keywords} onChange={(v) => setPage(r.path, "keywords", v)} testId={`seo-pg-kw-${r.path}`} />
                    <Input label="Robots" value={pg.robots} onChange={(v) => setPage(r.path, "robots", v)} testId={`seo-pg-robots-${r.path}`} placeholder="index, follow" />
                  </div>
                  <Area label="GEO AI summary" rows={2} value={pg.geo_summary} onChange={(v) => setPage(r.path, "geo_summary", v)} testId={`seo-pg-geo-${r.path}`} />
                  <ImageField label="Social share image" value={pg.og_image} onChange={(v) => setPage(r.path, "og_image", v)} testId={`seo-pg-og-${r.path}`} />
                </div>
              </details>
            );
          })}
        </div>
      </SectionCard>

      <div className="bg-ice border border-powder p-4 mb-5 text-[13px] text-midnight" data-testid="seo-discovery-urls">
        <p className="font-semibold mb-1">Discovery files (auto-updated):</p>
        <ul className="space-y-1 text-slatesage break-all">
          <li>Sitemap: <a className="text-navy underline" href={`${BACKEND}/api/sitemap.xml`} target="_blank" rel="noreferrer">{BACKEND}/api/sitemap.xml</a></li>
          <li>Robots: <a className="text-navy underline" href={`${BACKEND}/api/robots.txt`} target="_blank" rel="noreferrer">{BACKEND}/api/robots.txt</a></li>
          <li>AI (llms.txt): <a className="text-navy underline" href={`${BACKEND}/api/llms.txt`} target="_blank" rel="noreferrer">{BACKEND}/api/llms.txt</a></li>
        </ul>
      </div>

      <div className="flex items-center gap-4 sticky bottom-0 bg-ice py-3">
        <button onClick={save} disabled={saving} className="btn-amber" data-testid="seo-save"><span className="btn-arrow"><Save size={14} /></span><span>{saving ? "Saving…" : "Save SEO & GEO"}</span></button>
        {msg && <span className={`text-[13px] font-semibold ${msg.ok ? "text-emerald-600" : "text-red-600"}`} data-testid="seo-save-msg">{msg.text}</span>}
      </div>
    </div>
  );
}
