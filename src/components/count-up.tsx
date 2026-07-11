"use client";

import { useEffect, useRef, useState } from "react";

/** Counts a numeric stat up on first reveal; non-numeric values render as-is. */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(/^\d+$/.test(value) ? "0" : value);

  useEffect(() => {
    if (!/^\d+$/.test(value)) return;
    const el = ref.current;
    if (!el) return;
    const target = parseInt(value, 10);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduced) {
          setDisplay(String(target));
          return;
        }
        const t0 = performance.now();
        const dur = 1300;
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          setDisplay(String(Math.round(target * eased)));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
