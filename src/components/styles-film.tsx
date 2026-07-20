"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useScrollerFilm } from "@/lib/film";
import { showcasePanels } from "@/lib/site";

/**
 * Styles & Materials header — a nested scroll-snap pager (mandatory + snap-stop).
 * Scrolling ALWAYS lands centered on the next material title — you never rest
 * between two. A "Next" button advances a title at a time (and on into the
 * estimate builder from the last). When you reach the last material, one more
 * scroll/swipe hands off to the page so you continue past the section.
 */
const F0 = 3 / 7; // the film's material section starts at the wide wood shot

export function StylesFilm() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const progress = useScrollerFilm(scrollerRef, canvasRef, F0, 1);

  const n = showcasePanels.length; // 5
  const pos = progress * (n - 1); // 0..4 (which material we're on/between)
  const current = Math.round(pos);

  function toBuilder() {
    document
      .getElementById("builder")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Next button → next centered title, or into the builder from the last.
  function goNext() {
    const sc = scrollerRef.current;
    if (!sc) return;
    const i = Math.round(sc.scrollTop / sc.clientHeight);
    if (i >= n - 1) toBuilder();
    else sc.scrollTo({ top: (i + 1) * sc.clientHeight, behavior: "smooth" });
  }

  function quoteStyle(slug: string) {
    window.dispatchEvent(new CustomEvent("slf:pick-material", { detail: slug }));
    toBuilder();
  }

  // Let the page scroll PAST the pager at its ends (the one thing the nested
  // scroller can't do on its own), and show/hide the Next button with it.
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const atBottom = () =>
      sc.scrollTop >= sc.scrollHeight - sc.clientHeight - 2;
    const atTop = () => sc.scrollTop <= 2;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && atBottom()) {
        e.preventDefault();
        toBuilder();
      } else if (e.deltaY < 0 && atTop()) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => (startY = e.touches[0].clientY);
    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY; // >0 = swiped up = go down
      if (dy > 36 && atBottom()) toBuilder();
      else if (dy < -36 && atTop()) window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Show the Next button only while the pager fills the viewport.
    const onPageScroll = () => {
      const nav = nextRef.current;
      if (!nav) return;
      const r = sc.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      const show = r.top < mid && r.bottom > mid;
      nav.style.opacity = show ? "1" : "0";
      nav.style.pointerEvents = show ? "auto" : "none";
    };

    sc.addEventListener("wheel", onWheel, { passive: false });
    sc.addEventListener("touchstart", onTouchStart, { passive: true });
    sc.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onPageScroll, { passive: true });
    window.addEventListener("resize", onPageScroll);
    onPageScroll();
    return () => {
      sc.removeEventListener("wheel", onWheel);
      sc.removeEventListener("touchstart", onTouchStart);
      sc.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onPageScroll);
      window.removeEventListener("resize", onPageScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={scrollerRef}
        className="h-[100svh] snap-y snap-mandatory overflow-y-auto overscroll-y-auto bg-grove-deep [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Pinned film — the scroll scrubs it; sections below overlay it */}
        <div className="pointer-events-none sticky top-0 z-0 -mb-[100svh] h-[100svh]">
          <canvas ref={canvasRef} className="h-full w-full" />
          <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-grove-deep/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-grove-deep/90 via-grove-deep/30 to-transparent" />
        </div>

        {/* One snap stop per material */}
        {showcasePanels.map((p, i) => {
          const opacity = Math.max(0, 1 - Math.abs(pos - i) * 1.7);
          const active = opacity > 0.5;
          return (
            <section
              key={p.slug}
              className="relative z-10 h-[100svh] snap-start [scroll-snap-stop:always]"
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

      {/* Next button — labeled, fixed bottom-right, shown while in the pager */}
      <button
        ref={nextRef}
        type="button"
        onClick={goNext}
        aria-label="Next fence style"
        className="fixed bottom-[13vh] right-4 z-40 inline-flex touch-manipulation items-center gap-1.5 rounded-full bg-cream px-5 py-3 text-sm font-semibold text-grove shadow-lg shadow-black/40 ring-1 ring-black/5 transition-[opacity,transform] duration-300 hover:bg-cream-deep active:scale-95 sm:right-6"
        style={{ opacity: 0, pointerEvents: "none" }}
      >
        Next <ChevronDown className="h-4 w-4" />
      </button>
    </>
  );
}
