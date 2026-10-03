import { cssPath, describeEl, sectionName } from "./review";
import { typographyCss } from "./typography";
import { iconMaskUrl } from "./iconLibrary";

export { cssPath, describeEl, sectionName };

export const isEditUi = (el) => !!el?.closest?.("[data-le-ui]");

// Selectors inside a duplicated section are anchored to the block so they stay stable.
export const editPath = (el) => {
  const block = el?.closest?.("le-block[data-le-block]");
  if (!block) return cssPath(el);
  const parts = [];
  let node = el;
  while (node && node !== block) {
    let sel = node.tagName.toLowerCase();
    const parent = node.parentElement;
    if (parent) {
      const same = Array.from(parent.children).filter((c) => c.tagName === node.tagName);
      if (same.length > 1) sel += `:nth-of-type(${same.indexOf(node) + 1})`;
    }
    parts.unshift(sel);
    node = parent;
  }
  const base = `le-block[data-le-block="${block.dataset.leBlock}"]`;
  return parts.length ? `${base} > ${parts.join(" > ")}` : base;
};

const px = (v) => (/^-?[\d.]+$/.test(String(v)) ? `${v}px` : v);

const CSS_MAP = {
  hidden: () => "",
  backgroundColor: (v) => `background-color:${v} !important;background-image:none !important`,
  backgroundImage: (v) => `background-image:${v} !important;background-size:cover !important;background-position:center !important`,
  color: (v) => `color:${v} !important`,
  fontSize: (v) => `font-size:${px(v)} !important`,
  fontWeight: (v) => `font-weight:${v} !important`,
  fontFamily: (v) => `font-family:${v} !important`,
  fontStyle: (v) => `font-style:${v} !important`,
  textDecoration: (v) => `text-decoration:${v} !important`,
  lineHeight: (v) => `line-height:${v} !important`,
  letterSpacing: (v) => `letter-spacing:${px(v)} !important`,
  textAlign: (v) => `text-align:${v} !important`,
  textTransform: (v) => `text-transform:${v} !important`,
  borderRadius: (v) => `border-radius:${px(v)} !important`,
  // Uniform paddings authored in the editor stay fixed on desktop but shrink on
  // small screens — horizontal caps so sections don't collapse into a narrow
  // guttered column, vertical tightens so phones don't feel airy.
  padding: (v) => {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 0) {
      const vert = `min(${n}px, max(40px, 10vw))`;
      const horiz = `min(${n}px, max(24px, 7vw))`;
      return `padding:${vert} ${horiz} !important`;
    }
    return `padding:${px(v)} !important`;
  },
  margin: (v) => `margin:${px(v)} !important`,
  borderColor: (v) => `border-color:${v} !important`,
  borderWidth: (v) => `border-width:${px(v)} !important;border-style:solid !important`,
  boxShadow: (v) => `box-shadow:${v} !important`,
  opacity: (v) => `opacity:${v} !important`,
  objectFit: (v) => `object-fit:${v} !important`,
  maxHeight: (v) => `max-height:${px(v)} !important`,
  iconSize: (v) => `width:${px(v)} !important;height:${px(v)} !important`,
  iconSrc: (v) => `background:url("${v}") center/contain no-repeat !important`,
  iconName: () => "",
  iconStroke: () => "",
};
const ORDER = Object.keys(CSS_MAP);

export const STYLE_KEYS = ORDER;

const pageScope = (path) => `html[data-le-page="${path.replace(/"/g, '\\"')}"][data-le-page] `;

export const SCOPES = [
  { id: "all", label: "All screens" },
  { id: "tablet", label: "Tablet ↓" },
  { id: "phone", label: "Phone ↓" },
];
const MEDIA = { phone: "@media (max-width:767px)", tablet: "@media (max-width:1023px)" };

export const scopeKey = (selector, scope) => (scope && scope !== "all" ? `${selector}@@${scope}` : selector);
export const splitKey = (key = "") => {
  const i = key.indexOf("@@");
  return i < 0 ? { selector: key, scope: "all" } : { selector: key.slice(0, i), scope: key.slice(i + 2) };
};

// Older positional selectors and newer stable selectors may identify the same
// element. Update their values together rather than deleting saved design data.
export const relatedEditKeys = (key, edits) => {
  const { selector, scope } = splitKey(key);
  const keys = new Set([key]);
  try {
    const targets = document.querySelectorAll(selector);
    if (targets.length !== 1) return [...keys];
    edits.forEach(edit => {
      const alias = splitKey(edit.selector).selector;
      try {
        const matches = document.querySelectorAll(alias);
        if (matches.length === 1 && matches[0] === targets[0]) keys.add(scopeKey(alias, scope));
      } catch { /* Ignore invalid stored selectors without changing their data. */ }
    });
  } catch { /* A detached or invalid target keeps its original key. */ }
  return [...keys];
};

export const buildCss = (path, edits) =>
  [...edits]
    .sort((a, b) => SCOPES.findIndex(s => s.id === splitKey(a.selector).scope) - SCOPES.findIndex(s => s.id === splitKey(b.selector).scope))
    .map((e) => {
      const { selector, scope } = splitKey(e.selector);
      if (!selector) return "";
      const out = [];
      // Give saved element selectors equal weight; a legacy #root selector must
      // not overpower a stable selector or a narrower responsive override.
      const target = `${pageScope(path)}:is(#root, #root *):where(${selector})`;
      const body = ORDER.filter((k) => e.props?.[k] !== undefined && e.props[k] !== "")
        .map((k) => CSS_MAP[k](e.props[k]))
        .filter(Boolean)
        .join(";");
      if (body) out.push(`${target}{${body}}`);
      const mask = !e.props?.iconSrc && e.props?.iconName && iconMaskUrl(e.props.iconName, e.props.iconStroke);
      if (mask) out.push(`${target}{-webkit-mask:${mask} center/contain no-repeat !important;mask:${mask} center/contain no-repeat !important;background-color:currentColor !important}`);
      if (e.props?.iconSrc || mask) out.push(`${target} > *{visibility:hidden !important}`);
      if (e.props?.hidden) {
        const inner = `:is(#root, #root *):where(${selector})`;
        const scopeSel = pageScope(path).trim().replace(/^html/, "");
        out.push(`html:not([data-le-editing])${scopeSel} ${inner}{display:none !important}`);
        out.push(`html[data-le-editing]${scopeSel} ${inner}{opacity:0.35 !important;outline:2px dashed #ef4444 !important;outline-offset:-2px !important}`);
      }
      const hover = [
        e.props?.hoverBackgroundColor && `background-color:${e.props.hoverBackgroundColor} !important;background-image:none !important`,
        e.props?.hoverColor && `color:${e.props.hoverColor} !important`,
      ].filter(Boolean).join(";");
      if (hover) out.push(`${target}:hover{${hover}}`);
      const css = out.join("\n");
      if (!css) return "";
      return MEDIA[scope] ? `${MEDIA[scope]}{${css}}` : css;
    })
    .filter(Boolean)
    .join("\n");

export const themeCss = (t = {}) => {
  const out = [];
  if (t.brand) out.push(`.bg-navy{background-color:${t.brand} !important}.text-navy{color:${t.brand} !important}.border-navy{border-color:${t.brand} !important}.bg-midblue{background-color:${t.brand} !important}`);
  if (t.royal) out.push(`.bg-royal{background-color:${t.royal} !important}.text-royal{color:${t.royal} !important}`);
  if (t.accent) out.push(`.btn-amber{background:${t.accent} !important}.bg-amber{background-color:${t.accent} !important}.text-amber{color:${t.accent} !important}.border-amber{border-color:${t.accent} !important}`);
  if (t.pageBg) out.push(`.page-in{background-color:${t.pageBg} !important}`);
  out.push(typographyCss(t));
  return out.join("\n");
};

// Clicks inside an icon land on its inner shapes; edit the whole icon instead.
export const iconRoot = (el) => {
  let svg = el?.closest?.("svg");
  if (!svg) return el;
  while (svg.parentElement?.closest("svg")) svg = svg.parentElement.closest("svg");
  return svg;
};

export const canEditText = (el) => !!el && el.children.length === 0 && el.tagName !== "IMG" && el.tagName !== "SVG" && !el.closest("svg");

// Every visible piece of wording inside an element, in document order.
export const textNodesOf = (el, limit = 30) => {
  if (!el) return [];
  const reject = (p) => !p || p.closest("script, style, [data-le-ui]") || (p.closest("svg") && !p.closest("text"));
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (!n.nodeValue.trim() || reject(n.parentElement) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const out = [];
  while (walker.nextNode() && out.length <= limit) out.push(walker.currentNode);
  return out.length > limit ? [] : out;
};

const setNodeText = (node, value) => {
  const cur = node.nodeValue;
  const next = cur.match(/^\s*/)[0] + value + cur.match(/\s*$/)[0];
  if (cur !== next) node.nodeValue = next;
};
const applyParts = (el, parts) => {
  const nodes = textNodesOf(el);
  if (nodes.length !== parts.length) return;
  nodes.forEach((n, i) => { if (typeof parts[i] === "string") setNodeText(n, parts[i] || "\u200B"); });
};

const originals = new Map();
export const applyContent = (edits) => {
  const active = new Map();
  edits.forEach(({ selector, props }) => {
    const key = splitKey(selector);
    if (key.scope !== 'all') return;
    try { const el = document.querySelector(key.selector); if (el) active.set(el, props); } catch { /* Invalid stored selector is ignored. */ }
  });
  originals.forEach((values, el) => {
    if (!el.isConnected) { originals.delete(el); return; }
    Object.entries(values).forEach(([key, value]) => {
      if (active.get(el)?.[key] !== undefined) return;
      if (key === 'text') { if (el.textContent !== value) el.textContent = value; }
      else if (key === 'textParts') applyParts(el, value);
      else if (value === null) { if (el.hasAttribute(key)) el.removeAttribute(key); }
      else if (el.getAttribute(key) !== value) el.setAttribute(key, value);
    });
  });
  edits.forEach(({ selector: key, props }) => {
    if (!props) return;
    const { selector, scope } = splitKey(key);
    if (scope !== "all") return;
    let el = null;
    try { el = document.querySelector(selector); } catch { return; }
    if (!el) return;
    const values = originals.get(el) || {};
    ['text', 'src', 'alt', 'href', 'target'].forEach(k => {
      if (props[k] !== undefined && !(k in values) && (k !== 'text' || el.children.length === 0)) values[k] = k === 'text' ? el.textContent : el.getAttribute(k);
    });
    if (Array.isArray(props.textParts) && !('textParts' in values)) values.textParts = textNodesOf(el).map((n) => n.nodeValue.trim());
    originals.set(el, values);
    if (Array.isArray(props.textParts)) applyParts(el, props.textParts);
    if (props.src && el.tagName === "IMG" && el.getAttribute("src") !== props.src) el.setAttribute("src", props.src);
    if (props.alt !== undefined && el.tagName === "IMG" && el.getAttribute("alt") !== props.alt) el.setAttribute("alt", props.alt);
    if (props.href && el.tagName === "A" && el.getAttribute("href") !== props.href) el.setAttribute("href", props.href);
    if (props.target && el.tagName === "A" && el.getAttribute("target") !== props.target) {
      el.setAttribute("target", props.target);
      el.setAttribute("rel", "noopener noreferrer");
    }
    if (props.text !== undefined && el.children.length === 0 && el.textContent !== props.text) el.textContent = props.text;
  });
};

export const CONTENT_KEYS = ["text", "textParts", "src", "alt", "href", "target"];

export const SHADOWS = [
  { label: "None", value: "none" },
  { label: "Soft", value: "0 6px 18px -10px rgba(16,24,40,0.25)" },
  { label: "Medium", value: "0 14px 34px -14px rgba(16,24,40,0.35)" },
  { label: "Strong", value: "0 24px 60px -20px rgba(16,24,40,0.5)" },
  { label: "Hard edge", value: "6px 6px 0 rgba(26,26,46,0.85)" },
];

export const SWATCHES = ["#084c98", "#00388e", "#1a5fa8", "#4a92e6", "#faaf6a", "#fcd1a5", "#d4883a", "#90a999", "#6b7a78", "#1a1a2e", "#eef1f7", "#c8d2de", "#ffffff", "#000000"];

export const GRADIENTS = [
  { label: "Royal blue", value: "linear-gradient(120deg,#0f4aa3 0%,#1b61be 52%,#4a92e6 100%)" },
  { label: "Midnight", value: "linear-gradient(135deg,#1a1a2e 0%,#0d2a52 100%)" },
  { label: "Deep green", value: "linear-gradient(135deg,#20372c 0%,#3c5a46 100%)" },
  { label: "Amber", value: "linear-gradient(120deg,#fdbc7f 0%,#f3a458 100%)" },
  { label: "Ice", value: "linear-gradient(160deg,#ffffff 0%,#eef1f7 100%)" },
  { label: "Sage", value: "linear-gradient(140deg,#dfe8e2 0%,#90a999 100%)" },
];

export const FONTS = [
  { label: "Default", value: "" },
  { label: "Playfair Display (serif)", value: "'Playfair Display', Georgia, serif" },
  { label: "DM Sans", value: "'DM Sans', system-ui, sans-serif" },
  { label: "Inter", value: "'Inter', system-ui, sans-serif" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "DM Mono", value: "'DM Mono', monospace" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Lora (serif)", value: "'Lora', Georgia, serif" },
  { label: "Georgia", value: "Georgia, serif" },
];
