import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scroll-triggered, decode-aware left-to-right wipe for hero visuals.
// Replaces the old mount-time keyframe that could finish before the element
// scrolled into view (so it "popped" in) or before its image decoded.
// Now hero visuals reveal left-to-right as they enter the viewport, exactly
// like the content images handled by ImageReveal.
export default function HeroWipe() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(document.querySelectorAll("#root main .hero-wipe"));
    if (!els.length) return undefined;

    const reveal = (el) => el.classList.add("hw-in");

    if (reduce) {
      els.forEach(reveal);
      return undefined;
    }

    const revealWhenReady = (el) => {
      // Wait for the inner image to decode so the wipe reveals real pixels.
      const img = el.tagName === "IMG" ? el : el.querySelector("img");
      if (img && !img.complete) {
        const done = () => {
          img.removeEventListener("load", done);
          img.removeEventListener("error", done);
          reveal(el);
        };
        img.addEventListener("load", done);
        img.addEventListener("error", done);
        return;
      }
      reveal(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            io.unobserve(e.target);
            revealWhenReady(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));

    // Safety: never leave a hero visual hidden behind an un-fired reveal.
    const safety = setTimeout(() => els.forEach(reveal), 4000);

    return () => {
      clearTimeout(safety);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
