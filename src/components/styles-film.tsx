"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useFilmScrub, resolveSegs, totalUnits, type Seg } from "@/lib/film";
import { StreamVideo } from "@/components/stream-video";
import { showcasePanels } from "@/lib/site";
import { materialFilm, stream } from "@/lib/media";

/**
 * Styles & Materials header — the fence-material film.
 * Mobile: a scroll-snap "reels" pager. Each material is a full-screen stop;
 * a swipe snaps to the next one and its Cloudflare Stream slide-in plays in
 * crisp adaptive quality. You never get stuck between stops.
 * Desktop: the scroll-scrubbed canvas film.
 */
const F0 = 3 / 7;
const B = (i: number) => F0 + ((1 - F0) * i) / 4;
const SEGMENTS: Seg[] = [
  { kind: "hold", at: B(0), units: 0.8, overlay: 0 },
  { kind: "play", from: B(0), to: B(1), units: 0.9 },
  { kind: "hold", at: B(1), units: 0.8, overlay: 1 },
  { kind: "play", from: B(1), to: B(2), units: 0.9 },
  { kind: "hold", at: B(2), units: 0.8, overlay: 2 },
  { kind: "play", from: B(2), to: B(3), units: 0.9 },
  { kind: "hold", at: B(3), units: 0.8, overlay: 3 },
  { kind: "play", from: B(3), to: B(4), units: 0.9 },
  { kind: "hold", at: B(4), units: 1, overlay: 4, final: true },
];
const WRAP_VH = 100 + Math.round(totalUnits(SEGMENTS) * 80);

// Slide down to the builder with this style pre-selected (rAF so nothing cancels it)
function quoteStyle(slug: string) {
  window.dispatchEvent(new CustomEvent("slf:pick-material", { detail: slug }));
  const el = document.getElementById("builder");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.scrollIntoView();
    return;
  }
  const OFFSET = 60;
  const D0 = el.getBoundingClientRect().top - OFFSET;
  const dur = 850;
  const t0 = performance.now();
  const ease = (k: number) =>
    k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / dur);
    const want = D0 * (1 - ease(k));
    const cur = el.getBoundingClientRect().top - OFFSET;
    document.scrollingElement!.scrollTop += cur - want;
    if (k < 1) requestAnimationFrame(step);
    else {
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

  // ---- mobile reels: which stop is on screen ----
  const reelsRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const root = reelsRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll("[data-reel]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio >= 0.55) {
            setCurrent(Number((e.target as HTMLElement).dataset.reel));
          }
        });
      },
      { root, threshold: [0.55, 0.8] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ---------- MOBILE: scroll-snap reels ---------- */}
      <div
        ref={reelsRef}
        className="h-[100svh] snap-y snap-mandatory overflow-y-auto overscroll-y-contain lg:hidden"
      >
        {showcasePanels.map((p, i) => (
          <section
            key={p.slug}
            data-reel={i}
            className="relative flex h-[100svh] snap-start snap-always flex-col overflow-hidden bg-grove-deep"
            aria-label={p.name}
          >
            <StreamVideo
              uid={materialFilm[p.slug]}
              active={current === i}
              poster={stream.poster(materialFilm[p.slug])}
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* legibility scrims */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-grove-deep/75 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-grove-deep/90 via-grove-deep/40 to-transparent" />

            {/* giant word */}
            <div className="pointer-events-none absolute inset-x-0 top-[11%] flex justify-center">
              <span className="whitespace-nowrap font-display text-[15vw] font-semibold leading-none tracking-tight text-cream drop-shadow-[0_2px_18px_rgba(22,56,38,0.7)]">
                {p.word}
              </span>
            </div>

            {/* details + quote */}
            <div className="absolute inset-x-5 bottom-[9%] z-10 flex flex-col items-center text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold drop-shadow">
                {String(i + 1).padStart(2, "0")} / 05
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-semibold text-cream drop-shadow">
                {p.name}
              </h2>
              <p className="mt-1.5 max-w-sm text-sm leading-snug text-cream drop-shadow">
                {p.detail}
              </p>
              <button
                type="button"
                onClick={() => quoteStyle(p.slug)}
                className="mt-4 inline-flex touch-manipulation items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-black/30 active:scale-95"
              >
                Quote this style <ArrowRight className="h-4 w-4 rotate-90" />
              </button>
            </div>

            {/* progress dots */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
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

            {/* swipe hint on the first reel */}
            {i === 0 && (
              <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-grove-deep/60 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-cream backdrop-blur">
                  Swipe — the yard stays, the fence changes
                  <ChevronDown className="h-4 w-4 animate-bounce" />
                </span>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* ---------- DESKTOP: scroll-scrubbed canvas film ---------- */}
      <div
        ref={wrapRef}
        className="relative hidden lg:block"
        style={{ height: `${WRAP_VH}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-grove-deep">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-grove-deep/50 via-transparent to-grove-deep/60" />

          {panel && (
            <>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-[57%] z-10 flex justify-center"
                style={{ opacity: holdOpacity }}
              >
                <span className="whitespace-nowrap font-display text-[9.5vw] font-semibold leading-[0.9] tracking-tight text-cream drop-shadow-[0_2px_18px_rgba(22,56,38,0.6)]">
                  {panel.word}
                </span>
              </div>

              <div
                className="absolute inset-x-12 top-[63%] z-10 flex justify-center"
                style={{
                  opacity: holdOpacity,
                  transform: `translate3d(0, ${(1 - holdOpacity) * 16}px, 0)`,
                }}
              >
                <div className="flex max-w-xl flex-col items-center text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold drop-shadow">
                    {String((overlay as number) + 1).padStart(2, "0")} / 05
                  </p>
                  <h2 className="mt-1.5 font-display text-3xl font-semibold text-cream drop-shadow">
                    {panel.name}
                  </h2>
                  <p className="mt-1.5 max-w-md text-base leading-snug text-cream drop-shadow">
                    {panel.detail}
                  </p>
                  <button
                    type="button"
                    onClick={() => quoteStyle(panel.slug)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-black/25 transition-all hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                    style={{ pointerEvents: holdOpacity > 0.5 ? "auto" : "none" }}
                  >
                    Quote this style <ArrowRight className="h-4 w-4 rotate-90" />
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
                {showcasePanels.map((_, i) => (
                  <span
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: overlay === i ? 28 : 10,
                      background:
                        overlay === i
                          ? "var(--gold)"
                          : "rgba(250,243,231,0.35)",
                    }}
                  />
                ))}
              </div>
            </>
          )}

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
    </>
  );
}
