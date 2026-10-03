import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SELECTOR = "section h1, section h2, section h3, section h4, section p, section li, section blockquote";
const SKIP = ".reveal, [data-testid='site-footer'], nav, header, [role='dialog'], .admin-shell";

const TextReveal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer;
    const timer = setTimeout(() => {
      const nodes = Array.from(document.querySelectorAll(SELECTOR)).filter(
        (el) =>
          !el.closest(SKIP) &&
          !el.className.toString().includes("animate-fade") &&
          el.textContent.trim().length > 0
      );
      const seen = new Map();
      nodes.forEach((el) => {
        const key = el.parentElement;
        const i = (seen.get(key) || 0) + 1;
        seen.set(key, i);
        el.style.transitionDelay = `${Math.min((i - 1) * 120, 420)}ms`;
        el.classList.add("treveal");
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("treveal-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -14% 0px" }
      );
      nodes.forEach((el) => observer.observe(el));
    }, 60);

    const safety = setTimeout(() => {
      document.querySelectorAll(".treveal:not(.treveal-in)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("treveal-in");
      });
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(safety);
      if (observer) observer.disconnect();
      document.querySelectorAll(".treveal").forEach((el) => {
        el.classList.remove("treveal", "treveal-in");
        el.style.transitionDelay = "";
      });
    };
  }, [pathname]);

  return null;
};

export default TextReveal;
