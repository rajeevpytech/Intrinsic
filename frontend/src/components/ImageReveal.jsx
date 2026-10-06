import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Left-to-right reveal for genuine content images as they scroll in.
// Uses scroll + getBoundingClientRect (NOT IntersectionObserver) so it stays
// accurate under the site's CSS `zoom`, and includes a safety sweep so an image
// can never get stuck hidden behind an un-fired reveal.
// Hero images that opt into the deterministic `.hero-wipe` keyframe are skipped here.
export default function ImageReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const eligible = (img) => {
      if (img.getAttribute("aria-hidden") === "true") return false;
      let cs;
      try { cs = window.getComputedStyle(img); } catch { return false; }
      if (cs.position === "absolute" || cs.position === "fixed") return false; // layered visuals
      if (parseFloat(cs.opacity) < 1) return false;                            // intentional opacity
      const rect = img.getBoundingClientRect();
      const w = rect.width || img.naturalWidth || 0;
      if (w && w < 120) return false;                                          // icons / logos
      return true;
    };

    const revealAll = () => {
      document.querySelectorAll("#root main img.lr-reveal:not(.lr-reveal-in)").forEach((img) => img.classList.add("lr-reveal-in"));
    };

    const scan = () => {
      document.querySelectorAll("#root main img:not([data-lr]):not(.air-reveal):not(.hero-wipe):not(.no-reveal)").forEach((img) => {
        img.setAttribute("data-lr", "1");
        if (!eligible(img)) return;
        // Only clip images below the current viewport; in/above-view images stay visible.
        if (img.getBoundingClientRect().top < window.innerHeight * 0.9) return;
        img.classList.add("lr-reveal");
      });
    };

    const reveal = () => {
      document.querySelectorAll("#root main img.lr-reveal:not(.lr-reveal-in)").forEach((img) => {
        if (img.getBoundingClientRect().top < window.innerHeight * 0.92) img.classList.add("lr-reveal-in");
      });
    };

    if (reduce) {
      const t = setTimeout(revealAll, 100);
      return () => clearTimeout(t);
    }

    const onScroll = () => reveal();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const timers = [80, 500, 1400].map((d) => setTimeout(() => { scan(); reveal(); }, d));
    const iv = setInterval(reveal, 500);
    // Safety: nothing stays hidden. Force-reveal any remaining clipped images.
    const safety = setTimeout(() => { revealAll(); clearInterval(iv); }, 4000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(safety);
      clearInterval(iv);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
