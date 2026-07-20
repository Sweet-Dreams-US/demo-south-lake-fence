"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useFilmScrub, type Seg } from "@/lib/film";
import { showcasePanels } from "@/lib/site";

/**
 * Styles & Materials header — driven by the PAGE scroll (a sticky, pinned canvas
 * behind a stack of full-height material sections, like the homepage hero). It
 * behaves as a PAGER: any swipe advances exactly one material in the direction
 * you swiped (so a gentle swipe still lands on the next title, never a
 * half-state), and at the ends it releases so the page — including the builder
 * below — scrolls free (no trap). A Next button jumps to the next centered
 * title. No nested scroller: identical on mobile and desktop.
 */
const F0 = 3 / 7; // the film's material section starts at the wide wood shot
const SEGMENTS: Seg[] = [{ kind: "play", from: F0, to: 1, units: 1 }];
const n = showcasePanels.length; // 5

export function StylesFilm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const animatingRef = useRef(false);
  const progress = useFilmScrub(wrapRef, canvasRef, SEGMENTS, F0, 1);

  const pos = progress * (n - 1); // 0..4 (which material we're on/between)
  const current = Math.round(pos);

  // Geometry of the material stops in absolute page coordinates.
  const geom = () => {
    const wrap = wrapRef.current!;
    const range = wrap.offsetHeight - window.innerHeight;
    const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
    return { range, wrapTop, step: range / (n - 1) };
  };

  const glideTo = (i: number, smooth = true) => {
    const { wrapTop, step } = geom();
    animatingRef.current = true;
    window.scrollTo({
      top: Math.round(wrapTop + i * step),
      behavior: smooth ? "smooth" : "auto",
    });
    window.setTimeout(() => (animatingRef.current = false), 650);
  };

  // Next button → next centered title (or on into the builder from the last).
  function goNext() {
    if (!wrapRef.current) return;
    const { range, wrapTop, step } = geom();
    if (range <= 0) return;
    const cur = Math.max(
      0,
      Math.min(n - 1, Math.round((window.scrollY - wrapTop) / step)),
    );
    if (cur >= n - 1) {
      document
        .getElementById("builder")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      glideTo(cur + 1);
    }
  }

  // Pager: when a scroll settles, advance one material in the direction of
  // travel. Never rests between two, and releases at the ends so the page is
  // free to continue (the builder exit keeps working).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastY = window.scrollY;

    const updateNav = () => {
      const nav = nextRef.current;
      if (!nav) return;
      const { range, wrapTop } = geom();
      const y = window.scrollY;
      const show = range > 0 && y >= wrapTop - 4 && y <= wrapTop + range + 4;
      nav.style.opacity = show ? "1" : "0";
      nav.style.pointerEvents = show ? "auto" : "none";
    };

    const settle = () => {
      if (animatingRef.current) return;
      const { range, wrapTop, step } = geom();
      if (range <= 0) return;
      const y = window.scrollY;
      const raw = (y - wrapTop) / step; // 0..(n-1) across the materials
      const down = y >= lastY;
      lastY = y;
      if (raw > n - 1 + 0.5 || raw < -0.5) return; // in the builder / above → free
      if (raw > n - 1 + 0.15 && down) return; // exiting down past the last → free
      if (raw < -0.15 && !down) return; // exiting up past the first → free
      let i = down ? Math.ceil(raw - 0.02) : Math.floor(raw + 0.02);
      i = Math.min(n - 1, Math.max(0, i));
      if (Math.abs(wrapTop + i * step - y) > 3) glideTo(i, !reduce);
    };

    const hasScrollEnd = "onscrollend" in window;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      updateNav();
      if (animatingRef.current || reduce || hasScrollEnd) return;
      clearTimeout(idle);
      idle = setTimeout(settle, 130);
    };
    updateNav();
    if (hasScrollEnd && !reduce) window.addEventListener("scrollend", settle);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateNav);
    return () => {
      if (hasScrollEnd && !reduce)
        window.removeEventListener("scrollend", settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateNav);
      clearTimeout(idle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function quoteStyle(slug: string) {
    window.dispatchEvent(new CustomEvent("slf:pick-material", { detail: slug }));
    document
      .getElementById("builder")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div ref={wrapRef} className="relative bg-grove-deep">
      {/* Pinned film — the page scroll scrubs it; the sections below overlay it.
          The first material section carries the -mt so the canvas unpins exactly
          when the last material is reached and the page continues cleanly. */}
      <div className="pointer-events-none sticky top-0 z-0 h-[100svh]">
        <canvas ref={canvasRef} className="h-full w-full" />
        <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-grove-deep/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-grove-deep/90 via-grove-deep/30 to-transparent" />
      </div>

      {/* One full-height stop per material (the pager lands on each) */}
      {showcasePanels.map((p, i) => {
        const opacity = Math.max(0, 1 - Math.abs(pos - i) * 1.7);
        const active = opacity > 0.5;
        return (
          <section
            key={p.slug}
            className={`relative z-10 h-[100svh] ${i === 0 ? "-mt-[100svh]" : ""}`}
            aria-label={p.name}
          >
            {/* giant word — anchored just above the fence line */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-[57%] flex justify-center"
              style={{ opacity }}
            >
              <span className="whitespace-nowrap font-display text-[15vw] font-semibold leading-none tracking-tight text-cream drop-shadow-[0_2px_18px_rgba(22,56,38,0.7)] lg:text-[9.5vw]">
                {p.word}
              </span>
            </div>

            {/* details + quote — just below the fence line */}
            <div
              className="absolute inset-x-5 top-[62%] flex flex-col items-center text-center lg:inset-x-0"
              style={{ opacity, pointerEvents: active ? "auto" : "none" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold drop-shadow">
                {String(i + 1).padStart(2, "0")} / 0{n}
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-semibold text-cream drop-shadow">
                {p.name}
              </h2>
              <p className="mt-1.5 max-w-sm text-sm leading-snug text-cream drop-shadow lg:max-w-md lg:text-base">
                {p.detail}
              </p>
              <button
                type="button"
                onClick={() => quoteStyle(p.slug)}
                className="mt-4 inline-flex touch-manipulation items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-black/30 transition-transform active:scale-95"
              >
                Quote this style <ArrowRight className="h-4 w-4 rotate-90" />
              </button>
            </div>

            {/* progress dots */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {showcasePanels.map((_, k) => (
                <span
                  key={k}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: current === k ? 26 : 9,
                    background:
                      current === k ? "var(--gold)" : "rgba(250,243,231,0.4)",
                  }}
                />
              ))}
            </div>

            {/* first-stop hint */}
            {i === 0 && (
              <div
                className="pointer-events-none absolute inset-x-0 top-5 flex justify-center"
                style={{ opacity: current === 0 ? 1 : 0 }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full bg-grove-deep/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream backdrop-blur">
                  Scroll — the yard stays, the fence changes
                  <ChevronDown className="h-4 w-4 animate-bounce" />
                </span>
              </div>
            )}
          </section>
        );
      })}

      {/* Next-title button — fixed bottom-center, shown only while in the pager */}
      <button
        ref={nextRef}
        type="button"
        onClick={goNext}
        aria-label={current >= n - 1 ? "Continue to estimate" : "Next fence style"}
        className="fixed bottom-[8vh] left-1/2 z-40 flex h-12 w-12 -translate-x-1/2 touch-manipulation items-center justify-center rounded-full bg-cream text-grove shadow-lg shadow-black/40 ring-1 ring-black/5 transition-[opacity,transform] duration-300 hover:bg-cream-deep active:scale-90"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        <ChevronDown className="h-6 w-6" />
      </button>
    </div>
  );
}
