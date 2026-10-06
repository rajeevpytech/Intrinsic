import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, errMsg, getToken } from "../../lib/api";
import { buildCss, themeCss, applyContent, CONTENT_KEYS, splitKey, cssPath, relatedEditKeys } from "../../lib/liveedit";

const LiveEditContext = createContext(null);

// Saved edits for every page, kept in the browser so a page paints with its edits immediately.
const CACHE_KEY = "intr_live_edits_cache";
const editsCache = (() => {
  const initial = window.__INTRINSIC_PUBLIC_DATA__?.["/api/live-edits"];
  if (initial) {
    const grouped = {};
    initial.forEach(edit => { (grouped[edit.path] ||= []).push(edit); });
    return grouped;
  }
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; }
})();
const persistCache = () => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(editsCache)); } catch { /* storage full */ } };
const cachePage = (path, list) => { editsCache[path] = list; persistCache(); };
const NO_EDITS = [];
// First visit: the page stays invisible (see index.html) until saved edits and theme arrive.
let firstPaintPending = 2;
const firstPaintStep = () => {
  if (--firstPaintPending > 0) return;
  document.documentElement.classList.remove("le-wait");
  try { localStorage.setItem("intr_live_edits_ready", "1"); } catch { /* storage full */ }
};
const readJson = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } };
const writeJson = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage full */ } };
export const useLiveEdit = () => useContext(LiveEditContext);

const styleTag = (id) => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("style");
    el.id = id;
    document.head.appendChild(el);
  }
  return el;
};

export default function LiveEditProvider({ children }) {
  const { pathname } = useLocation();
  const [edits, setEdits] = useState([]);
  const [theme, setTheme] = useState(() => readJson("intr_theme_cache", {}));
  const [themePreview, setThemePreview] = useState(null);
  const [customCss, setCustomCss] = useState(() => readJson("intr_custom_css_cache", ""));
  const [customCssPreview, setCustomCssPreview] = useState(null);
  const [framePreview, setFramePreview] = useState(null);
  const [themeReady, setThemeReady] = useState(false);
  const [themeError, setThemeError] = useState("");
  const [editsPath, setEditsPath] = useState(null);
  const [editsError, setEditsError] = useState("");
  const [editsLoadAttempt, setEditsLoadAttempt] = useState(0);
  const [savedEdits, setSavedEdits] = useState([]);
  const editsRef = useRef([]);
  const timers = useRef({});
  editsRef.current = edits;
  const [cacheTick, setCacheTick] = useState(0);

  useEffect(() => {
    api.get("/live-edits").then(({ data }) => {
      const grouped = {};
      (data || []).forEach((e) => { (grouped[e.path] ||= []).push(e); });
      Object.keys(editsCache).forEach((k) => delete editsCache[k]);
      Object.assign(editsCache, grouped);
      persistCache();
      setCacheTick((t) => t + 1);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (window.parent === window) return;
    const receive = event => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === 'intrinsic-typography-preview') setThemePreview(event.data.theme);
      if (event.data?.type === 'intrinsic-custom-css-preview' && typeof event.data.css === 'string') setCustomCssPreview(event.data.css);
      if (event.data?.type === 'intrinsic-live-edits-preview' && event.data.path === window.location.pathname && Array.isArray(event.data.edits) && event.data.edits.every(edit => typeof edit?.selector === 'string' && edit.props && typeof edit.props === 'object')) {
        setFramePreview({ path: event.data.path, edits: event.data.edits });
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  useLayoutEffect(() => { document.documentElement.dataset.lePage = pathname; }, [pathname]);

  useEffect(() => {
    let alive = true;
    setEditsPath(null);
    setEditsError("");
    setEdits([]);
    setSavedEdits([]);
    history.current = [];
    setHistoryLen(0);
    api.get("/live-edits", { params: { path: pathname } })
      .then(({ data }) => {
        if (alive) {
          cachePage(pathname, data || []);
          setEdits(data || []);
          setSavedEdits(data || []);
          setEditsPath(pathname);
        }
      })
      .catch(error => { if (alive) setEditsError(errMsg(error)); });
    return () => { alive = false; };
  }, [pathname, editsLoadAttempt]);
  const reloadEdits = useCallback(() => setEditsLoadAttempt(value => value + 1), []);
  const editsReady = editsPath === pathname;

  // Hold the first paint (see le-wait in index.html) until the INITIAL page's
  // own edits are applied — otherwise the hero paints its coded default colour
  // for a frame before the saved live-edit colour swaps in (a visible flash).
  const firstPaintArmed = useRef(false);
  useEffect(() => {
    if (firstPaintArmed.current) return;
    if (editsPath === pathname || editsError) {
      firstPaintArmed.current = true;
      requestAnimationFrame(() => requestAnimationFrame(firstPaintStep));
    }
  }, [editsPath, editsError, pathname]);

  const renderedEdits = useMemo(
    () => (framePreview?.path === pathname ? framePreview.edits : editsReady ? edits : editsCache[pathname] || NO_EDITS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [framePreview, pathname, editsReady, edits, cacheTick]
  );

  const reloadTheme = useCallback(async () => {
    setThemeReady(false);
    setThemeError("");
    try {
      const { data } = await api.get("/theme");
      setTheme(data);
      writeJson("intr_theme_cache", data);
      setThemeReady(true);
    } catch (error) { setThemeError(errMsg(error)); }
    finally { firstPaintStep(); }
  }, []);
  useEffect(() => { reloadTheme(); }, [reloadTheme]);

  useLayoutEffect(() => { styleTag("le-overrides").textContent = buildCss(pathname, renderedEdits); }, [renderedEdits, pathname]);
  useLayoutEffect(() => { styleTag("le-theme").textContent = themeCss(themePreview || theme); }, [theme, themePreview]);

  useEffect(() => {
    let active = true;
    api.get('/custom-css').then(({ data }) => { if (active) { setCustomCss(data.css); writeJson("intr_custom_css_cache", data.css); } }).catch(() => {});
    return () => { active = false; };
  }, [pathname]);
  useLayoutEffect(() => {
    if (/^\/admin(?:\/|$)/.test(pathname)) document.getElementById('site-custom-css')?.remove();
  }, [pathname]);
  useEffect(() => {
    if (/^\/admin(?:\/|$)/.test(pathname)) return;
    const element = styleTag('site-custom-css');
    element.textContent = customCssPreview ?? customCss;
    document.head.appendChild(element);
    return () => element.remove();
  }, [pathname, customCss, customCssPreview, edits, theme, themePreview]);

  // Apply cached text/image content edits BEFORE the browser paints, so navigating
  // to a page never flashes the coded default text/image before the saved edit swaps in.
  useLayoutEffect(() => {
    const content = renderedEdits.filter((e) => CONTENT_KEYS.some((k) => e.props?.[k] !== undefined && e.props[k] !== ""));
    if (content.length) applyContent(content);
  }, [renderedEdits, pathname]);

  useEffect(() => {
    const content = renderedEdits.filter((e) => CONTENT_KEYS.some((k) => e.props?.[k] !== undefined && e.props[k] !== ""));
    applyContent(content);
    if (!content.length) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => applyContent(content));
    };
    run();
    const obs = new MutationObserver(run);
    obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["src", "href", "target", "alt"] });
    const iv = setInterval(run, 1200);
    return () => { obs.disconnect(); clearInterval(iv); cancelAnimationFrame(raf); };
  }, [renderedEdits, pathname]);

  // React Router <Link>s ignore a changed href, so honour edited links ourselves.
  useEffect(() => {
    const links = edits.filter((e) => e.props?.href);
    if (!links.length) return;
    const onClick = (e) => {
      const a = e.target.closest?.("a");
      if (!a || a.closest("[data-le-ui]") || document.documentElement.dataset.leEditing === "1") return;
      const hit = links.find((l) => { try { return document.querySelector(splitKey(l.selector).selector) === a; } catch { return false; } });
      if (!hit) return;
      e.preventDefault();
      e.stopPropagation();
      const href = hit.props.href;
      if (hit.props.target === "_blank" || /^https?:/i.test(href)) window.open(href, hit.props.target === "_blank" ? "_blank" : "_self", "noopener");
      else window.location.assign(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [edits]);


  const saveEdits = useCallback(async () => {
    if (!editsReady) throw new Error("Wait for saved page edits to load before saving.");
    const snapshot = editsRef.current;
    const selectors = [...new Set([...savedEdits, ...snapshot].map(e => e.selector))]
      .filter(selector => JSON.stringify(snapshot.find(e => e.selector === selector)?.props || {}) !== JSON.stringify(savedEdits.find(e => e.selector === selector)?.props || {}));
    await Promise.all(selectors.map(selector => {
      const edit = snapshot.find(e => e.selector === selector);
      return api.put('/live-edits', { path: pathname, selector, label: edit?.label || '', props: edit?.props || {} });
    }));
    setSavedEdits(snapshot);
    cachePage(pathname, snapshot);
  }, [savedEdits, pathname, editsReady]);
  const hasUnsavedEdits = editsReady && JSON.stringify(edits) !== JSON.stringify(savedEdits);
  useEffect(() => {
    if (!hasUnsavedEdits) return;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedEdits]);


  const propsFor = useCallback((selector) => editsRef.current.find((e) => e.selector === selector)?.props || {}, []);

  const history = useRef([]);
  const lastPush = useRef({ selector: "", at: 0 });
  const [historyLen, setHistoryLen] = useState(0);

  const setProps = useCallback((selector, label, patch) => {
    const list = editsRef.current;
    const records = new Map(list.map(edit => [edit.selector, edit]));
    relatedEditKeys(selector, list).forEach(key => {
      const existing = records.get(key);
      const next = { ...(existing?.props || {}), ...patch };
      Object.keys(next).forEach(k => { if (next[k] === null || next[k] === undefined || next[k] === "") delete next[k]; });
      if (Object.keys(next).length) records.set(key, existing ? { ...existing, props: next } : { selector: key, label, props: next, path: pathname });
      else records.delete(key);
    });
    const updated = [...records.values()];
    if (JSON.stringify(updated) === JSON.stringify(list)) return;
    const now = Date.now();
    if (!(lastPush.current.selector === selector && now - lastPush.current.at < 1500)) {
      history.current.push(list);
      if (history.current.length > 40) history.current.shift();
      setHistoryLen(history.current.length);
    }
    lastPush.current = { selector, at: now };
    editsRef.current = updated;
    setEdits(updated);
  }, [pathname]);

  const undo = useCallback(() => {
    const previous = history.current.pop();
    setHistoryLen(history.current.length);
    if (!previous) return;
    editsRef.current = previous;
    setEdits(previous);
    lastPush.current = { selector: '', at: 0 };
  }, []);

  const resetSelector = useCallback(async (selector) => {
    setEdits((prev) => prev.filter((e) => e.selector !== selector));
    cachePage(pathname, (editsCache[pathname] || []).filter((e) => e.selector !== selector));
    clearTimeout(timers.current[selector]);
    await api.delete("/live-edits", { params: { path: pathname, selector } }).catch(() => {});
    window.location.reload();
  }, [pathname]);

  const resetPage = useCallback(async () => {
    setEdits([]);
    cachePage(pathname, []);
    await api.delete("/live-edits", { params: { path: pathname } }).catch(() => {});
    window.location.reload();
  }, [pathname]);

  const resetAll = useCallback(async () => {
    setEdits([]);
    Object.keys(editsCache).forEach((k) => delete editsCache[k]);
    persistCache();
    await api.delete("/live-edits", { params: { path: "*" } }).catch(() => {});
    window.location.reload();
  }, []);

  const previewTheme = useCallback((draft) => setThemePreview(draft), []);
  const saveTheme = useCallback(async (patch) => {
    if (!themeReady) throw new Error("Load the saved site theme before making changes.");
    const { data } = await api.put("/theme", patch);
    setTheme(data);
    writeJson("intr_theme_cache", data);
    setThemePreview(null);
  }, [themeReady]);

  // ---- Duplicated sections ----
  const [blocks, setBlocks] = useState([]);
  const blocksRef = useRef([]);
  blocksRef.current = blocks;

  const loadBlocks = useCallback(async () => {
    try {
      const { data } = await api.get("/live-blocks", { params: { path: pathname } });
      setBlocks(data || []);
    } catch { setBlocks([]); }
  }, [pathname]);

  useEffect(() => { loadBlocks(); }, [loadBlocks]);

  useEffect(() => {
    document.querySelectorAll("le-block[data-le-block]").forEach((n) => {
      if (!blocks.some((b) => b.id === n.dataset.leBlock)) n.remove();
    });
    if (!blocks.length) return;
    let raf = 0;
    const sync = () => {
      blocks.forEach((b) => {
        let anchor = null, src = null;
        try { anchor = document.querySelector(b.anchor_selector); } catch { anchor = null; }
        if (!anchor) return;
        let node = document.querySelector(`le-block[data-le-block="${b.id}"]`);
        if (!node) {
          try { src = document.querySelector(b.source_selector); } catch { src = null; }
          if (!src) return;
          const clone = src.cloneNode(true);
          clone.querySelectorAll("le-block, [data-le-ui]").forEach((n) => n.remove());
          clone.removeAttribute("id");
          clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
          clone.querySelectorAll("[data-testid]").forEach((n) => n.removeAttribute("data-testid"));
          node = document.createElement("le-block");
          node.dataset.leBlock = b.id;
          node.style.display = "block";
          node.appendChild(clone);
        }
        if (b.position === "before") {
          if (anchor.previousElementSibling !== node) anchor.before(node);
        } else if (anchor.nextElementSibling !== node) anchor.after(node);
      });
    };
    const run = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); };
    run();
    const obs = new MutationObserver(run);
    obs.observe(document.body, { subtree: true, childList: true });
    const iv = setInterval(run, 1200);
    return () => { obs.disconnect(); clearInterval(iv); cancelAnimationFrame(raf); };
  }, [blocks, pathname]);

  const addBlock = useCallback(async (sourceSelector, anchorSelector) => {
    const { data } = await api.post("/live-blocks", { path: pathname, source_selector: sourceSelector, anchor_selector: anchorSelector, position: "after" });
    setBlocks((p) => [...p, data]);
    return data;
  }, [pathname]);

  const moveBlock = useCallback(async (id, dir) => {
    const node = document.querySelector(`le-block[data-le-block="${id}"]`);
    if (!node) return;
    const target = dir === "down" ? node.nextElementSibling : node.previousElementSibling;
    if (!target) return;
    const { data } = await api.patch(`/live-blocks/${id}`, {
      anchor_selector: cssPath(target), position: dir === "down" ? "after" : "before",
    });
    setBlocks((p) => p.map((b) => (b.id === id ? data : b)));
  }, []);

  const removeBlock = useCallback(async (id) => {
    await api.delete(`/live-blocks/${id}`).catch(() => {});
    document.querySelector(`le-block[data-le-block="${id}"]`)?.remove();
    setBlocks((p) => p.filter((b) => b.id !== id));
    window.location.reload();
  }, []);

  const value = { edits, editsReady, editsError, reloadEdits, theme, themeReady, themeError, reloadTheme, previewTheme, saveEdits, hasUnsavedEdits, propsFor, setProps, resetSelector, resetPage, resetAll, undo, historyLen, saveTheme, blocks, addBlock, moveBlock, removeBlock, isAdmin: !!getToken(), path: pathname };
  return <LiveEditContext.Provider value={value}>{children}</LiveEditContext.Provider>;
}
