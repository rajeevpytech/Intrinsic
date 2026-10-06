import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TARGETS = "main section :is(h1,h2,h3,h4,p,ul,ol,blockquote,figure,table,button,a[class*=btn],svg:not(.lucide))";
const SKIP = ".reveal,.treveal,.areveal,[class*=animate-],[data-no-reveal],nav,header,footer,form,button,a,li,h1,h2,h3,h4,p";

const apply = (io) => {
  document.querySelectorAll(TARGETS).forEach((el) => {
    if (el.classList.contains("areveal")) return;
    if (el.tagName.toLowerCase() === "svg" ? el.parentElement?.closest("svg") : el.closest("svg")) return;
    if (el.parentElement && el.parentElement.closest(SKIP)) return;
    if (el.style.transform || el.style.opacity) return;
    const section = el.closest("section");
    const idx = section ? Math.min((section.__ar = (section.__ar || 0) + 1) - 1, 5) : 0;
    el.classList.add("areveal");
    el.style.transitionDelay = `${idx * 80}ms`;
    io.observe(el);
  });
  applyImages(io);
};

const applyImages = (io) => {
  document.querySelectorAll("main img").forEach((img) => {
    if (img.closest("nav,header,footer")) return;
    if (img.classList.contains("air-band")) { img.dataset.imgReveal = "1"; return; }
    img.loading = "lazy";
    img.decoding = "async";
    if (img.dataset.imgReveal) return;
    if (img.classList.contains("hero-wipe") || img.closest(".hero-wipe")) { img.dataset.imgReveal = "1"; return; }
    if (img.classList.contains("air-band")) { img.dataset.imgReveal = "1"; return; }
    // leave motion-overlay images (ImageMotion: img + sibling svg) and existing draw-outs un-wiped
    if (img.parentElement && img.parentElement.querySelector("svg")) { img.dataset.imgReveal = "1"; return; }
    if (img.classList.contains("bc-wipe") || img.closest(".reveal")?.querySelector(".bc-wipe,.draw-h,.draw-v")) { img.dataset.imgReveal = "1"; return; }
    // hidden at this breakpoint (display:none) -> don't wipe now; will be retried on next scan/resize
    if (img.offsetParent === null && img.getClientRects().length === 0) return;
    img.dataset.imgReveal = "1";
    img.classList.add("img-reveal");
    io.observe(img);
  });
};

export default function AutoReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    let t = setTimeout(() => apply(io), 60);
    const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => apply(io), 120); });
    const main = document.querySelector("main") || document.body;
    mo.observe(main, { childList: true, subtree: true });
    let rt;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => applyImages(io), 200); };
    window.addEventListener("resize", onResize);
    return () => { clearTimeout(t); clearTimeout(rt); window.removeEventListener("resize", onResize); mo.disconnect(); io.disconnect(); };
  }, [pathname]);
  return null;
}
