"use client";

import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useFilmScrub, type Seg } from "@/lib/film";
import { showcasePanels } from "@/lib/site";

/**
 * Styles & Materials header — driven by the PAGE scroll (a sticky, pinned canvas
 * behind a stack of full-height material sections, exactly like the homepage
 * hero). The fence-material film scrubs wood → aluminum → vinyl → chain-link →
 * iron as you scroll, and each section opts into CSS scroll-snap so you LAND on
 * a material instead of stopping between two — but it's the page scrolling
 * (proximity snap), so it never traps and flows straight into the sections
 * below. No nested scroller: same behavior on mobile and desktop.
 */
const F0 = 3 / 7; // the film's material section starts at the wide wood shot
const SEGMENTS: Seg[] = [{ kind: "play", from: F0, to: 1, units: 1 }];

export function StylesFilm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useFilmScrub(wrapRef, canvasRef, SEGMENTS, F0, 1);

  const n = showcasePanels.length; // 5
  const pos = progress * (n - 1); // 0..4 (which material we're on/between)
  const current = Math.round(pos);

  function quoteStyle(slug: string) {
    window.dispatchEvent(new CustomEvent("slf:pick-material", { detail: slug }));
    document
      .getElementById("builder")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div ref={wrapRef} className="relative bg-grove-deep">
      {/* Pinned film — the page scroll scrubs it; the sections below overlay it */}
      <div className="pointer-events-none sticky top-0 z-0 -mb-[100svh] h-[100svh]">
        <canvas ref={canvasRef} className="h-full w-full" />
        <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-grove-deep/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-grove-deep/90 via-grove-deep/30 to-transparent" />
      </div>

      {/* One snap stop per material — the page snaps to each (proximity) */}
      {showcasePanels.map((p, i) => {
        const opacity = Math.max(0, 1 - Math.abs(pos - i) * 1.7);
        const active = opacity > 0.5;
        return (
          <section
            key={p.slug}
            className="relative z-10 h-[100svh] snap-start"
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
    </div>
  );
}
