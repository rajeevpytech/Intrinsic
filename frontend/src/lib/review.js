const FLAG = "intr_review";
const NAME = "intr_review_name";

export const isReviewMode = () => {
  const qs = new URLSearchParams(window.location.search);
  if (qs.get("review") === "1") localStorage.setItem(FLAG, "1");
  if (qs.get("review") === "0") localStorage.removeItem(FLAG);
  return localStorage.getItem(FLAG) === "1";
};
export const exitReviewMode = () => localStorage.removeItem(FLAG);
export const getReviewerName = () => localStorage.getItem(NAME) || "";
export const setReviewerName = (n) => localStorage.setItem(NAME, n);

export const isReviewUi = (el) => !!el?.closest?.("[data-review-ui]");

export const cssPath = (el) => {
  const parts = [];
  let node = el;
  while (node && node.nodeType === 1 && node !== document.body) {
    const testId = node.getAttribute("data-testid");
    const candidates = [
      testId && `[data-testid="${CSS.escape(testId)}"]`,
      node.id && !/\d{4,}/.test(node.id) && `#${CSS.escape(node.id)}`,
    ].filter(Boolean);
    const anchor = candidates.find(selector => document.querySelectorAll(selector).length === 1);
    if (anchor) {
      if (node === el) return anchor;
      const tag = el.tagName.toLowerCase();
      if (node.querySelectorAll(tag).length === 1) return `${anchor} ${tag}`;
      return `${anchor} > ${parts.join(" > ")}`;
    }
    let sel = node.tagName.toLowerCase();
    const parent = node.parentElement;
    if (parent) {
      const same = Array.from(parent.children).filter((c) => c.tagName === node.tagName);
      if (same.length > 1) sel += `:nth-of-type(${same.indexOf(node) + 1})`;
    }
    parts.unshift(sel);
    node = parent;
  }
  return parts.join(" > ");
};

export const sectionName = (el) => {
  const sec = el.closest("section, header, footer, nav, main > div");
  if (!sec) return "";
  if (sec.tagName === "HEADER" || sec.tagName === "NAV") return "Top navigation";
  if (sec.tagName === "FOOTER") return "Footer";
  const h = sec.querySelector("h1, h2, h3");
  const t = (h?.innerText || "").trim().replace(/\s+/g, " ");
  return t ? t.slice(0, 40) : (sec.id ? sec.id : "Section");
};

export const describeEl = (el) => {
  const tag = el.tagName.toLowerCase();
  let what;
  if (tag === "img") what = `Image${el.alt ? `: ${el.alt}` : ""}`;
  else if (tag === "svg" || el.closest("svg")) what = el.getBoundingClientRect().width <= 80 ? "Icon" : "Graphic";
  else {
    const text = (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ");
    const name = { h1: "Heading", h2: "Heading", h3: "Heading", p: "Text", a: "Link", button: "Button", span: "Text" }[tag] || "Element";
    what = text ? `${name}: "${text.slice(0, 50)}${text.length > 50 ? "…" : ""}"` : name;
  }
  const sec = sectionName(el);
  return sec && !what.includes(sec) ? `${sec} › ${what}` : what;
};

export const resolveEl = (selector) => {
  if (!selector) return null;
  try { return document.querySelector(selector); } catch { return null; }
};

export const pinViewportPos = (pin) => {
  const el = resolveEl(pin.selector);
  if (el) {
    const r = el.getBoundingClientRect();
    if (r.width || r.height) return { x: r.left + r.width * pin.rel_x, y: r.top + r.height * pin.rel_y, found: true };
  }
  return { x: pin.doc_x - window.scrollX, y: pin.doc_y - window.scrollY, found: false };
};

export const fmtTime = (iso) => new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

const INTRO = "intr_review_intro_seen";
export const introSeen = () => localStorage.getItem(INTRO) === "1";
export const markIntroSeen = () => localStorage.setItem(INTRO, "1");

export const clientMessage = (link) =>
  `Hi! The website is ready for your review.\n\n` +
  `1. Open this link: ${link}\n` +
  `2. Enter your name once.\n` +
  `3. Click the orange "Add comment" button (bottom-right), then click on anything on the page — logo, text, image, animation — and type your comment.\n` +
  `4. A numbered pin marks each comment. Click a pin any time to read replies or mark it done.\n` +
  `5. Browse every page (menu links work normally) and comment on each section.\n\n` +
  `I'll see every comment instantly and reply right on the page. Thanks!`;
