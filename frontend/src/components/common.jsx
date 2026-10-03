import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import logoNavy from "../assets/logo-navy.webp";
import logoWhite from "../assets/logo-white.webp";

/* Intrinsic brand logo (official lockup) */
export const Logo = ({ color, size = 30 }) => {
  const white = !!color;
  return (
    <img
      src={white ? logoWhite : logoNavy}
      alt="Intrinsic"
      style={{ height: size + 10, width: "auto" }}
      className="w-auto max-w-full self-start shrink-0 object-contain select-none"
      data-testid="site-logo"
    />
  );
};

/* Scroll reveal wrapper (supports direction: up | left | right | scale) */
export const Reveal = ({ children, delay = 0, dir = "up", className = "", as: Tag = "div", ...rest }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [autoDelay, setAutoDelay] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!delay && el.parentElement) {
      const idx = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal")).indexOf(el);
      if (idx > 0) setAutoDelay(Math.min(idx * 120, 400));
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  const dirClass = dir === "left" ? "dir-left" : dir === "right" ? "dir-right" : dir === "scale" ? "dir-scale" : "";
  return (
    <Tag
      ref={ref}
      className={`reveal ${dirClass} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay || autoDelay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

/* Thin scroll progress bar at top of page */
export const ScrollProgress = () => {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setW(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <div className="scroll-progress" style={{ width: `${w}%` }} />;
};

/* Count-up number that animates when scrolled into view */
export const CountUp = ({ end, duration = 1600, prefix = "", suffix = "", className = "" }) => {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(end * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration, started]);
  return (
    <span ref={ref} className={className}>
      {prefix}{val}{suffix}
    </span>
  );
};

/* Amber CTA */
export const AmberButton = ({ children, className = "", ...props }) => (
  <button className={`btn-amber ${className}`} {...props}>
    <span>{children}</span>
    <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);

/* Outline CTA */
export const OutlineButton = ({ children, className = "", ...props }) => (
  <button className={`btn-outline ${className}`} {...props}>
    <span>{children}</span>
    <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
  </button>
);
