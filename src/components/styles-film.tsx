"use client";

import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useFilmScrub, resolveSegs, totalUnits, type Seg } from "@/lib/film";
import { showcasePanels } from "@/lib/site";

/**
 * Styles & Materials header: the fence-material film. Opens already settled
 * on the wood fence in the demo yard; each scroll slides the next material
 * across the ground. Every hold offers "Quote this style".
 */
const F0 = 3 / 7; // master film: wood settles at the end of clip 3
const B = (i: number) => F0 + ((1 - F0) * i) / 4; // material boundaries

const SEGMENTS: Seg[] = [
  { kind: "hold", at: B(0), units: 0.8, overlay: 0 }, // WOOD
  { kind: "play", from: B(0), to: B(1), units: 0.9 },
  { kind: "hold", at: B(1), units: 0.8, overlay: 1 }, // ALUMINUM
  { kind: "play", from: B(1), to: B(2), units: 0.9 },
  { kind: "hold", at: B(2), units: 0.8, overlay: 2 }, // VINYL
  { kind: "play", from: B(2), to: B(3), units: 0.9 },
  { kind: "hold", at: B(3), units: 0.8, overlay: 3 }, // CHAIN LINK
  { kind: "play", from: B(3), to: B(4), units: 0.9 },
  { kind: "hold", at: B(4), units: 1, overlay: 4, final: true }, // IRON
];

const WRAP_VH = 100 + Math.round(totalUnits(SEGMENTS) * 80);

export function StylesFilm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useFilmScrub(wrapRef, canvasRef, SEGMENTS, F0, 1);

  const { overlay, t, final } = resolveSegs(SEGMENTS, progress);
  const holdOpacity = final
    ? Math.min(1, t / 0.18)
    : Math.min(1, t / 0.18, (1 - t) / 0.18);
  const panel = typeof overlay === "number" ? showcasePanels[overlay] : null;
  const hintOpacity = Math.max(0, 1 - progress * totalUnits(SEGMENTS) * 1.4);

  // Slide down to the builder with this style pre-selected.
  // rAF-driven so nothing can cancel it (native smooth scroll is fragile).
  function quoteStyle(slug: string) {
    window.dispatchEvent(
      new CustomEvent("slf:pick-material", { detail: slug }),
    );
    const el = document.getElementById("builder");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollIntoView();
      return;
    }
    const OFFSET = 64; // land just below the sticky nav
    const D0 = el.getBoundingClientRect().top - OFFSET;
    const dur = 900;
    const t0 = performance.now();
    const ease = (k: number) =>
      k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      // element-anchored: close the *remaining* gap each frame so layout
      // shifts can't strand us; instant writes because
      // html{scroll-behavior:smooth} makes plain scrollTo self-canceling
      const want = D0 * (1 - ease(k));
      const cur = el.getBoundingClientRect().top - OFFSET;
      document.scrollingElement!.scrollTop += cur - want;
      if (k < 1) {
        requestAnimationFrame(step);
      } else {
        // settle: absorb any late layout shift
        let n = 0;
        const settle = () => {
          document.scrollingElement!.scrollTop +=
            el.getBoundingClientRect().top - OFFSET;
          if (++n < 4) requestAnimationFrame(settle);
        };
        requestAnimationFrame(settle);
      }
    };
    requestAnimationFrame(step);
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${WRAP_VH}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-grove-deep">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {/* soft edges for legibility, fence band stays clear */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-grove-deep/50 via-transparent to-grove-deep/60" />

        {panel && (
          <>
            {/* Giant word — hugs the top of the fence line */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-[57%] z-10 flex justify-center"
              style={{ opacity: holdOpacity }}
            >
              <span className="whitespace-nowrap font-display text-[15vw] font-semibold leading-[0.9] tracking-tight text-cream drop-shadow-[0_2px_18px_rgba(22,56,38,0.6)] sm:text-[9.5vw]">
                {panel.word}
              </span>
            </div>

            {/* Details — centered right below the fence line */}
            <div
              className="absolute inset-x-5 top-[63%] z-10 flex justify-center sm:inset-x-12"
              style={{
                opacity: holdOpacity,
                transform: `translate3d(0, ${(1 - holdOpacity) * 16}px, 0)`,
              }}
            >
              <div className="flex max-w-xl flex-col items-center text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold drop-shadow">
                  {String((overlay as number) + 1).padStart(2, "0")} / 05
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold text-cream drop-shadow sm:text-3xl">
                  {panel.name}
                </h2>
                <p className="mt-1.5 max-w-md text-sm leading-snug text-cream drop-shadow sm:text-base">
                  {panel.detail}
                </p>
                <button
                  type="button"
                  onClick={() => quoteStyle(panel.slug)}
                  className="mt-4 inline-flex touch-manipulation items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-black/25 transition-all hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                  style={{
                    pointerEvents: holdOpacity > 0.5 ? "auto" : "none",
                  }}
                >
                  Quote this style <ArrowRight className="h-4 w-4 rotate-90" />
                </button>
              </div>
            </div>

            {/* progress ticks */}
            <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
              {showcasePanels.map((_, i) => (
                <span
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: overlay === i ? 28 : 10,
                    background:
                      overlay === i ? "var(--gold)" : "rgba(250,243,231,0.35)",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Opening hint */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 z-10 flex justify-center"
          style={{ opacity: hintOpacity }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-grove-deep/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cream backdrop-blur">
            Scroll — the yard stays, the fence changes
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </span>
        </div>
      </div>
    </div>
  );
}
