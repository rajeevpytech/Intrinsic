import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trash2, Save, Upload, KeyRound, X, Send, Search, RefreshCw, Inbox, FileUser } from "lucide-react";
import { AdminLayout, ADMIN_TABS } from "../components/admin/AdminLayout";
import { AdminOverview } from "../components/admin/AdminOverview";
import TypographySettings from "../components/editor/TypographySettings";
import CustomCssPanel from "../components/admin/CustomCssPanel";
import MigrationPanel from "../components/admin/MigrationPanel";
import { api, getToken, clearToken, errMsg, imgUrl } from "../lib/api";
import { FeedbackView } from "./FeedbackView";
import { ModesView } from "./ModesView";
import SeoManager from "../components/admin/SeoManager";
import MarkdownEditor from "../components/admin/MarkdownEditor";

const SEO_FIELDS = [
  { k: "seo_title", label: "SEO Title — search & social (blank = use the title above)", type: "text" },
  { k: "seo_description", label: "SEO / GEO Meta Description (~155 chars; also read by AI engines)", type: "textarea" },
  { k: "seo_keywords", label: "SEO Keywords (comma separated)", type: "text" },
  { k: "geo_summary", label: "GEO AI Summary — a concise, factual answer AI engines can cite", type: "textarea" },
  { k: "og_image", label: "Social share image (Open Graph / Twitter)", type: "image" },
];

const SCHEMAS = {
  blogs: {
    label: "Blogs",
    fields: [
      { k: "category", label: "Category", type: "text" },
      { k: "catColor", label: "Tag Color", type: "color" },
      { k: "title", label: "Title", type: "text" },
      { k: "published", label: "Publish on the website", type: "checkbox", onLabel: "Published", offLabel: "Draft" },
      { k: "excerpt", label: "Excerpt", type: "textarea" },
      { k: "content", label: "Article body", type: "richtext" },
      { k: "author", label: "Author", type: "text" },
      { k: "date", label: "Date", type: "text" },
      { k: "read", label: "Read time", type: "text" },
      { k: "image", label: "Image", type: "image" },
      ...SEO_FIELDS,
    ],
  },
  testimonials: {
    label: "Testimonials",
    fields: [
      { k: "quote", label: "Quote", type: "textarea" },
      { k: "role", label: "Role", type: "text" },
      { k: "since", label: "Client since", type: "text" },
    ],
  },
  jobs: {
    label: "Job Listings",
    fields: [
      { k: "title", label: "Job Title", type: "text" },
      { k: "slug", label: "URL Slug (e.g. security-analyst)", type: "text" },
      { k: "category", label: "Category (e.g. Cybersecurity)", type: "text" },
      { k: "type", label: "Employment Type (e.g. Full Time)", type: "text" },
      { k: "location", label: "Location", type: "text" },
      { k: "published", label: "Visible on Careers page", type: "checkbox" },
      { k: "overview", label: "Overview", type: "textarea" },
      { k: "responsibilities", label: "What you'll do (one per line)", type: "list" },
      { k: "requirements", label: "Who you are (one per line)", type: "list" },
      { k: "preferred", label: "Preferred qualifications (one per line)", type: "list" },
      ...SEO_FIELDS,
    ],
  },
  "service-briefs": {
    label: "Service Briefs",
    fields: [
      { k: "title", label: "Title", type: "text" },
      { k: "service", label: "Service (filter label, e.g. Managed IT)", type: "text" },
      { k: "subtitle", label: "Subtitle (one line)", type: "text" },
      { k: "pages", label: "Page count (e.g. 2 pages)", type: "text" },
      { k: "summary", label: "Summary", type: "textarea" },
      { k: "points", label: "Key points (one per line)", type: "list" },
      { k: "cover", label: "Cover image (page 1 preview)", type: "image" },
      { k: "file", label: "Brief PDF", type: "pdf" },
      { k: "available", label: "Available for download", type: "checkbox" },
      ...SEO_FIELDS,
    ],
  },
  "case-studies": {
    label: "Case Studies",
    fields: [
      { k: "tag", label: "Tag (industry · service)", type: "text" },
      { k: "title", label: "Title", type: "text" },
      { k: "stat", label: "Stat highlight", type: "text" },
      { k: "summary", label: "Card summary (short, shown on cards)", type: "textarea" },
      { k: "body", label: "Summary / opening (one paragraph per line)", type: "textarea" },
      { k: "challenge", label: "The challenge", type: "textarea" },
      { k: "approach", label: "What we did", type: "textarea" },
      { k: "results", label: "Results (one per line)", type: "list" },
      { k: "quote", label: "Client quote (optional)", type: "textarea" },
      { k: "quote_author", label: "Quote attribution", type: "text" },
      { k: "image", label: "Image (optional)", type: "image" },
      { k: "pdf", label: "Case study PDF (optional, offered as a download)", type: "pdf" },
      ...SEO_FIELDS,
    ],
  },
};

const SITE_FIELDS = [
  { k: "hero_h1", label: "Hero heading" },
  { k: "hero_h2", label: "Hero subheading" },
  { k: "hero_paragraph", label: "Hero paragraph" },
  { k: "hero_cta", label: "Hero button label" },
  { k: "resources_heading", label: "Resources heading" },
  { k: "resources_sub", label: "Resources subtext" },
];

const Field = ({ f, value, onChange, testId }) => {
  const [uploading, setUploading] = useState(false);
  const doUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.path);
    } catch (err) {
      alert(errMsg(err));
    } finally {
      setUploading(false);
    }
  };
  if (f.type === "image") {
    return (
      <div>
        <label className="block text-[12px] font-semibold text-slatesage mb-1">{f.label}</label>
        {value && <img src={imgUrl(value)} alt="" className="w-full h-40 object-cover mb-2 border border-powder" />}
        <label className="btn-outline cursor-pointer inline-flex" data-testid={`${testId}-upload`}>
          <span className="btn-arrow"><Upload size={14} /></span>
          <span>{uploading ? "Uploading..." : "Upload Image"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={doUpload} data-testid={testId} />
        </label>
      </div>
    );
  }
  if (f.type === "pdf") {
    return (
      <div>
        <label className="block text-[12px] font-semibold text-slatesage mb-1">{f.label}</label>
        {value && <a href={imgUrl(value)} target="_blank" rel="noopener noreferrer" className="block text-[13px] text-navy underline mb-2 break-all" data-testid={`${testId}-link`}>View current PDF</a>}
        <label className="btn-outline cursor-pointer inline-flex" data-testid={`${testId}-upload`}>
          <span className="btn-arrow"><Upload size={14} /></span>
          <span>{uploading ? "Uploading..." : "Upload PDF"}</span>
          <input type="file" accept="application/pdf" className="hidden" onChange={doUpload} data-testid={testId} />
        </label>
      </div>
    );
  }
  if (f.type === "checkbox") {
    const on = value !== false;
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none mt-6">
        <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#0b3d91]" data-testid={testId} />
        <span className="text-[13px] font-semibold text-midnight">{f.label}</span>
        <span className={`eyebrow text-[10px] px-2 py-0.5 ${on ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`} data-testid={`${testId}-status`}>{on ? (f.onLabel || "Live") : (f.offLabel || "Hidden")}</span>
      </label>
    );
  }
  if (f.type === "list") {
    return (
      <div>
        <label className="block text-[12px] font-semibold text-slatesage mb-1">{f.label}</label>
        <textarea rows={4} value={Array.isArray(value) ? value.join("\n") : value || ""} onChange={(e) => onChange(e.target.value.split("\n"))} onBlur={(e) => onChange(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid={testId} />
      </div>
    );
  }
  if (f.type === "richtext") {
    return (
      <div>
        <label className="block text-[12px] font-semibold text-slatesage mb-1">{f.label}</label>
        <MarkdownEditor value={value} onChange={onChange} testId={testId} />
      </div>
    );
  }
  return (
    <div>
      <label className="block text-[12px] font-semibold text-slatesage mb-1">{f.label}</label>
      {f.type === "textarea" ? (
        <textarea rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid={testId} aria-label={f.label} />
      ) : (
        <input type={f.type} value={value || ""} onChange={(e) => onChange(e.target.value)} className={`border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy ${f.type === "color" ? "h-10 w-20 p-1" : "w-full"}`} data-testid={testId} aria-label={f.label} />
      )}
    </div>
  );
};

const CollectionEditor = ({ name }) => {
  const schema = SCHEMAS[name];
  const [items, setItems] = useState([]);
  const load = useCallback(async () => {
    const { data } = await api.get(`/admin/content/${name}`);
    setItems((arr) => [...arr.filter((it) => it._new), ...data]);
  }, [name]);
  useEffect(() => { load(); }, [load]);

  const setField = (idx, k, v) => setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, [k]: v } : it)));
  const addNew = () => setItems((arr) => [{ _new: true, ...(name === "blogs" ? { published: false } : {}) }, ...arr]);
  const save = async (idx) => {
    const it = items[idx];
    try {
      if (it._new || !it.id) {
        const { _new, ...body } = it;
        await api.post(`/content/${name}`, body);
        setItems((arr) => arr.filter((_, i) => i !== idx));
      } else {
        const { id, _new, ...body } = it;
        await api.put(`/content/${name}/${it.id}`, body);
      }
      await load();
    } catch (err) { alert(errMsg(err)); }
  };
  const remove = async (idx) => {
    const it = items[idx];
    if (!it.id) return setItems((arr) => arr.filter((_, i) => i !== idx));
    if (!window.confirm("Delete this item?")) return;
    try { await api.delete(`/content/${name}/${it.id}`); await load(); } catch (err) { alert(errMsg(err)); }
  };

  return (
    <div data-testid={`editor-${name}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-[26px] text-midnight font-semibold">{schema.label}</h2>
        <button onClick={addNew} className="btn-amber" data-testid={`add-${name}`}>
          <span className="btn-arrow"><Plus size={14} /></span><span>Add New</span>
        </button>
      </div>
      <div className="space-y-5">
        {items.map((it, idx) => (
          <div key={it.id || idx} className="bg-white border border-powder p-5" data-testid={`item-${name}-${idx}`}>
            <div className="grid sm:grid-cols-2 gap-4">
              {schema.fields.map((f) => (
                <div key={f.k} className={f.type === "textarea" || f.type === "image" || f.type === "list" || f.type === "pdf" || f.type === "richtext" ? "sm:col-span-2" : ""}>
                  <Field f={f} value={it[f.k]} onChange={(v) => setField(idx, f.k, v)} testId={`field-${name}-${idx}-${f.k}`} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => save(idx)} className="btn-amber" data-testid={`save-${name}-${idx}`}>
                <span className="btn-arrow"><Save size={14} /></span><span>Save</span>
              </button>
              <button onClick={() => remove(idx)} className="btn-outline" data-testid={`delete-${name}-${idx}`}>
                <span className="btn-arrow"><Trash2 size={14} /></span><span>Delete</span>
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-slatesage">No items yet. Click "Add New".</p>}
      </div>
    </div>
  );
};

const SiteEditor = () => {
  const [doc, setDoc] = useState(null);
  useEffect(() => { api.get("/content-site").then(({ data }) => setDoc(data)); }, []);
  const save = async () => {
    try { const { data } = await api.put("/content-site", doc); setDoc(data); alert("Saved!"); }
    catch (err) { alert(errMsg(err)); }
  };
  if (!doc) return null;
  return (
    <div data-testid="editor-site">
      <h2 className="font-serif text-[26px] text-midnight font-semibold mb-5">Hero & Section Text</h2>
      <div className="bg-white border border-powder p-5 space-y-4 max-w-[720px]">
        {SITE_FIELDS.map((f) => (
          <div key={f.k}>
            <label className="block text-[12px] font-semibold text-slatesage mb-1">{f.label}</label>
            <textarea rows={2} value={doc[f.k] || ""} onChange={(e) => setDoc({ ...doc, [f.k]: e.target.value })} className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid={`site-${f.k}`} />
          </div>
        ))}
        <button onClick={save} className="btn-amber" data-testid="save-site"><span className="btn-arrow"><Save size={14} /></span><span>Save</span></button>
      </div>
    </div>
  );
};

const EmailSettings = () => {
  const [s, setS] = useState(null);
  const [pwd, setPwd] = useState("");
  const [testTo, setTestTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    const { data } = await api.get("/email-settings");
    setS(data); setTestTo(data.gmail_address || "");
  }, []);
  useEffect(() => { load(); }, [load]);

  if (!s) return null;
  const set = (k) => (e) => setS((o) => ({ ...o, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const save = async () => {
    setBusy(true); setMsg(null);
    try {
      const payload = { ...s };
      if (pwd.trim()) payload.smtp_password = pwd.trim(); else payload.smtp_password = "";
      const { data } = await api.put("/email-settings", payload);
      setS(data); setPwd("");
      setMsg({ ok: true, text: "Email settings saved" });
    } catch (err) { setMsg({ ok: false, text: errMsg(err) }); }
    finally { setBusy(false); }
  };

  const sendTest = async () => {
    setBusy(true); setMsg(null);
    try {
      const { data } = await api.post("/email-settings/test", { to_email: testTo });
      setMsg({ ok: true, text: data.message });
    } catch (err) { setMsg({ ok: false, text: errMsg(err) }); }
    finally { setBusy(false); }
  };

  return (
    <div data-testid="editor-email" className="max-w-[720px]">
      <h2 className="font-serif text-[26px] text-midnight font-semibold mb-2">Email &amp; Inquiry Notifications</h2>
      <p className="text-slatesage text-[14px] mb-6">Choose where new contact-form inquiries are delivered, and optionally auto-send a thank-you email to visitors. Both use the Gmail account configured below.</p>

      <div className="bg-white border border-powder p-5 space-y-4 mb-5" data-testid="notify-card">
        <label className="flex items-center gap-3 cursor-pointer" data-testid="notify-enabled-wrap">
          <input type="checkbox" checked={!!s.notify_enabled} onChange={set("notify_enabled")} className="w-4 h-4 accent-navy" data-testid="notify-enabled" />
          <span className="text-[14px] font-semibold text-midnight">Email me when a new inquiry arrives</span>
        </label>
        <div>
          <label className="block text-[12px] font-semibold text-slatesage mb-1">Send inquiries to</label>
          <input value={s.notify_email || ""} onChange={set("notify_email")} placeholder="you@yourcompany.com" className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid="notify-email" />
          <p className="text-slatesage text-[12px] mt-1">Every inquiry is always saved in the Inquiries tab. When enabled, a copy with the full details is emailed here too.</p>
        </div>
      </div>

      <div className="bg-white border border-powder p-5 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer" data-testid="email-enabled-wrap">
          <input type="checkbox" checked={!!s.enabled} onChange={set("enabled")} className="w-4 h-4 accent-navy" data-testid="email-enabled" />
          <span className="text-[14px] font-semibold text-midnight">Send a confirmation email to the visitor</span>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-slatesage mb-1">Gmail address (sender)</label>
            <input value={s.gmail_address || ""} onChange={set("gmail_address")} placeholder="youraccount@gmail.com" className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid="email-gmail" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-slatesage mb-1">From name</label>
            <input value={s.from_name || ""} onChange={set("from_name")} placeholder="Intrinsic Team" className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid="email-fromname" />
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-slatesage mb-1">Gmail App Password {s.has_password && <span className="text-green-600 font-normal">(saved — leave blank to keep)</span>}</label>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder={s.has_password ? "•••• •••• •••• ••••" : "16-character app password"} className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid="email-password" />
          <p className="text-slatesage text-[12px] mt-1">Create at myaccount.google.com/apppasswords (needs 2-Step Verification on).</p>
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-slatesage mb-1">Subject</label>
          <input value={s.subject || ""} onChange={set("subject")} className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid="email-subject" />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slatesage mb-1">Message body</label>
          <textarea rows={8} value={s.body || ""} onChange={set("body")} className="w-full border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy font-mono" data-testid="email-body" />
        </div>

        {msg && <p className={`text-[13px] ${msg.ok ? "text-green-600" : "text-red-600"}`} data-testid="email-message">{msg.text}</p>}

        <div className="flex flex-wrap gap-3 pt-1">
          <button onClick={save} disabled={busy} className="btn-amber" data-testid="email-save"><span className="btn-arrow"><Save size={14} /></span><span>{busy ? "Saving..." : "Save Settings"}</span></button>
          <div className="flex items-center gap-2">
            <input value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="test@email.com" className="border border-powder px-3 py-2 text-[14px] focus:outline-none focus:border-navy" data-testid="email-test-to" />
            <button onClick={sendTest} disabled={busy} className="btn-outline" data-testid="email-test-send"><span className="btn-arrow"><Send size={14} /></span><span>Send Test</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InquiriesView = ({ applications = false, selectedId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const kind = applications ? 'applications' : 'inquiries';
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const { data } = await api.get('/inquiries', { params: { kind } }); setItems(data); }
    catch (err) { setError(errMsg(err)); }
    finally { setLoading(false); }
  }, [kind]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!loading && selectedId) document.getElementById(`submission-${selectedId}`)?.scrollIntoView({ block: 'start' });
  }, [loading, selectedId]);
  const remove = async (id) => {
    if (!window.confirm(`Delete this ${applications ? 'application' : 'inquiry'}? This cannot be undone.`)) return;
    try { await api.delete(`/inquiries/${id}`); await load(); } catch (err) { setError(errMsg(err)); }
  };
  const filtered = items.filter(item => [item.name, item.email, item.company, item.details?.role].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase().trim()));
  const EmptyIcon = applications ? FileUser : Inbox;
  return <div data-testid={`editor-${kind}`}>
    <h2 className="font-semibold text-[28px] mb-2">{applications ? 'Job applications' : 'Inquiries'}</h2>
    <p className="text-sm text-slate-500 mb-6">{applications ? 'Meet the people who want to be part of your team.' : 'Contact requests and assessment submissions, all in one place.'}</p>
    <div className="ad-submission-tools">
      <div className="ad-submission-search"><Search size={16} /><input aria-label={`Search ${kind}`} placeholder={applications ? 'Search name, email, or role…' : 'Search name, email, or company…'} value={search} onChange={e => setSearch(e.target.value)} data-testid={`${kind}-search`} /></div>
      <span className="ad-submission-count" data-testid={`${kind}-count`}>{loading ? 'Loading…' : `${filtered.length} ${kind}${items.length === 1000 ? ' · latest 1,000 records' : ''}`}</span>
      <button className="ad-button" onClick={load} disabled={loading} data-testid={`${kind}-refresh`}><RefreshCw size={14} />Refresh</button>
    </div>
    {error && <p className="ad-error mb-4" role="alert" data-testid={`${kind}-error`}>{error}</p>}
    {loading ? <p className="text-slate-500 text-sm" data-testid={`${kind}-loading`}>Loading submissions…</p> : !filtered.length ? <div className="ad-panel ad-empty" data-testid={`${kind}-empty`}><EmptyIcon size={28} /><strong>{search ? 'No matching submissions' : `No ${kind} yet`}</strong><p>{search ? 'Try another name or email address.' : applications ? 'New candidates will appear here when they apply on your Careers page.' : 'New contact and assessment submissions will appear here.'}</p></div> : <div className="space-y-4">
      {filtered.map(it => <article id={`submission-${it.id}`} key={it.id} data-testid={`inquiry-${it.id}`} className={`ad-submission-card ${selectedId === it.id ? 'is-highlighted' : ''}`}>
        <div className="ad-submission-heading"><div><p className="ad-submission-name">{it.name}<span className={`ad-badge ${applications ? 'ad-badge-amber' : 'ad-badge-teal'}`}>{applications ? 'Application' : it.type === 'assessment' ? 'Assessment' : 'Contact'}</span></p>
          <div className="ad-submission-meta"><a href={`mailto:${it.email}`} data-testid={`inquiry-email-${it.id}`}>{it.email}</a>{it.phone && <span>{it.phone}</span>}{it.company && <span>{it.company}</span>}<time dateTime={it.created_at}>{new Date(it.created_at).toLocaleString()}</time></div></div>
          <button onClick={() => remove(it.id)} className="ad-delete-button" data-testid={`inquiry-delete-${it.id}`} aria-label={`Delete submission from ${it.name}`}><Trash2 size={17} /></button></div>
        {it.details && <div className="ad-submission-details">{Object.entries(it.details).filter(([, value]) => value).map(([key, value]) => key === 'resume' ? <a key={key} href={imgUrl(value)} target="_blank" rel="noreferrer" className="ad-text-link" data-testid={`inquiry-resume-${it.id}`}>Download résumé</a> : <span key={key}><strong className="capitalize">{key.replace(/_/g, ' ')}: </strong>{String(value)}</span>)}</div>}
        {it.message && <p className="ad-submission-message">{it.message}</p>}
      </article>)}
    </div>}
  </div>;
};

const ChangePasswordModal = ({ onClose }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) { setMsg({ ok: false, text: "New passwords do not match" }); return; }
    if (next.length < 6) { setMsg({ ok: false, text: "New password must be at least 6 characters" }); return; }
    setLoading(true);
    try {
      await api.post("/auth/change-password", { current_password: current, new_password: next });
      setMsg({ ok: true, text: "Password updated successfully" });
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setMsg({ ok: false, text: errMsg(err) });
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4" data-testid="change-password-modal" onClick={onClose}>
      <div className="w-full max-w-[440px] bg-white p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slatesage hover:text-midnight" data-testid="change-password-close" aria-label="Close"><X size={20} /></button>
        <div className="inline-flex items-center justify-center w-11 h-11 bg-navy text-white mb-4"><KeyRound size={20} /></div>
        <h2 className="font-serif text-midnight text-[24px] font-semibold">Change Password</h2>
        <p className="text-slatesage text-[13px] mt-1 mb-5">Update the admin account password.</p>
        <form onSubmit={submit} className="space-y-4">
          <input data-testid="cp-current" type="password" autoComplete="current-password" required placeholder="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full border border-powder px-4 py-3 text-[15px] focus:outline-none focus:border-navy" />
          <input data-testid="cp-new" type="password" autoComplete="new-password" required placeholder="New password" value={next} onChange={(e) => setNext(e.target.value)} className="w-full border border-powder px-4 py-3 text-[15px] focus:outline-none focus:border-navy" />
          <input data-testid="cp-confirm" type="password" autoComplete="new-password" required placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border border-powder px-4 py-3 text-[15px] focus:outline-none focus:border-navy" />
          {msg && <p className={`text-[13px] ${msg.ok ? "text-green-600" : "text-red-600"}`} data-testid="cp-message">{msg.text}</p>}
          <button data-testid="cp-submit" disabled={loading} className="btn-amber w-full justify-center">
            <span className="btn-arrow"><Save size={14} /></span>
            <span>{loading ? "Updating..." : "Update Password"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const requestedTab = params.get('tab');
  const tab = ADMIN_TABS.includes(requestedTab) ? requestedTab : 'overview';
  const setTab = (key, selectedId) => setParams({ ...(key === 'overview' ? {} : { tab: key }), ...(selectedId ? { submission: selectedId } : {}) });
  const [ready, setReady] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (!getToken()) { navigate("/admin/login"); return; }
    api.get("/auth/me").then(() => setReady(true)).catch(() => { clearToken(); navigate("/admin/login"); });
  }, [navigate]);

  const logout = () => { clearToken(); navigate("/admin/login"); };
  if (!ready) return null;

  return (
    <>
      <AdminLayout tab={tab} onSelect={setTab} onPassword={() => setShowPwd(true)} onLogout={logout}>
        {tab === 'overview' ? <AdminOverview onSelect={setTab} /> : tab === 'custom-css' ? <CustomCssPanel /> : tab === 'migration' ? <MigrationPanel /> : tab === "typography" ? <div className="bg-white border border-powder rounded-lg p-4 sm:p-7"><TypographySettings /></div> : tab === "site" ? <SiteEditor /> : tab === "inquiries" || tab === 'applications' ? <InquiriesView key={tab} applications={tab === 'applications'} selectedId={params.get('submission')} /> : tab === "feedback" ? <FeedbackView /> : tab === "email" ? <EmailSettings /> : tab === "seo" ? <SeoManager /> : tab === "modes" ? <ModesView /> : <CollectionEditor name={tab} key={tab} />}
      </AdminLayout>
      {showPwd && <ChangePasswordModal onClose={() => setShowPwd(false)} />}
    </>
  );
};

export default AdminDashboard;
