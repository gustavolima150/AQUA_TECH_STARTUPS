"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** Scroll-based entrance animations; all content remains visible without JS and with reduced motion. */
export function ScrollReveal({ children, className = "", id }: {
  children: ReactNode; className?: string; id?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches || !('IntersectionObserver' in window)) return;
    el.classList.add("reveal-wait");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("reveal-in"); observer.unobserve(entry.target); } });
    }, { threshold: .08, rootMargin: "0px 0px -30px 0px" });
    observer.observe(el);
    return () => { observer.disconnect(); el.classList.remove("reveal-wait"); };
  }, []);
  return <div id={id} className={`v-reveal ${className}`} ref={ref}>{children}</div>;
}
