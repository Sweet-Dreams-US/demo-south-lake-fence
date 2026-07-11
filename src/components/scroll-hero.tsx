"use client";

import { useRef } from "react";
import Link from "next/link";
import { Phone, ChevronDown, ArrowRight } from "lucide-react";
import { useFilmScrub, resolveSegs, totalUnits, type Seg } from "@/lib/film";
import { business } from "@/lib/site";

/**
 * Homepage header: the short cut — fence builds, gate opens, logo reveals,
 * hold with CTA — then the page continues. The full fence-material film
 * lives on /styles.
 *
 * Desktop: full-bleed cover canvas. Mobile: the film sits in a 16:9 band so
 * the logo fits the phone width (cover of a 16:9 frame into a 16:9 box = no
 * crop), and the CTAs sit below it.
 */
const F = (i: number) => i / 7; // master-film clip boundaries

const SEGMENTS: Seg[] = [
  { kind: "play", from: F(0), to: F(1), units: 1 }, // build
  { kind: "play", from: F(1), to: F(2), units: 1 }, // logo reveal
  { kind: "hold", at: F(2), units: 0.9, overlay: "cta", final: true },
];

const WRAP_VH = 100 + Math.round(totalUnits(SEGMENTS) * 85);

export function ScrollHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useFilmScrub(wrapRef, canvasRef, SEGMENTS, 0, F(2));

  const { overlay, t } = resolveSegs(SEGMENTS, progress);
  const unitsPos = progress * totalUnits(SEGMENTS);
  const introOpacity = Math.max(0, 1 - unitsPos * 1.6);
  const hintOpacity = Math.max(0, 1 - unitsPos * 3);
  const ctaOpacity = overlay === "cta" ? Math.min(1, t / 0.2) : 0;

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${WRAP_VH}vh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-grove-deep">
        {/* Canvas: full-bleed on desktop; a tall band on mobile — sized to sit
            inside the logo's side margins so it fills the phone without cropping
            the wordmark, and leaves room for the CTAs below. */}
        <div className="absolute inset-x-0 top-[7vh] h-[50vh] sm:top-[9vh] sm:h-[52vh] lg:inset-0 lg:top-0 lg:h-full">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>

        {/* ---------- Desktop overlays (full-bleed) ---------- */}
        <div className="hidden lg:block">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-grove-deep/45 via-transparent to-grove-deep/70" />

          <div
            className="absolute inset-x-0 top-[18%] flex flex-col items-center px-6 text-center"
            style={{ opacity: introOpacity }}
          >
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur">
              Est. {business.since} · {business.years} years
            </span>
            <h1 className="max-w-4xl font-display text-6xl font-semibold leading-[1.05] text-cream drop-shadow-lg md:text-7xl">
              Lake County&apos;s Fence Family,
              <br /> Since 1997.
            </h1>
          </div>

          <div
            className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-1 text-cream/90"
            style={{ opacity: hintOpacity }}
          >
            <span className="text-xs font-medium uppercase tracking-widest">
              Scroll — watch us build it
            </span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>

          <div
            className="absolute inset-x-0 bottom-[7%] flex flex-col items-center px-6 text-center"
            style={{
              opacity: ctaOpacity,
              pointerEvents: ctaOpacity > 0.5 ? "auto" : "none",
            }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/styles#builder"
                className="rounded-full bg-clay px-7 py-3.5 text-base font-semibold text-cream shadow-lg shadow-black/25 transition-colors hover:bg-clay-dark"
              >
                Get a Free Estimate
              </Link>
              <a
                href={business.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-cream/40 bg-cream/10 px-6 py-3.5 text-base font-semibold text-cream backdrop-blur transition-colors hover:bg-cream/20"
              >
                <Phone className="h-4 w-4" /> {business.phone}
              </a>
            </div>
            <Link
              href="/styles"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cream/90 underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              Watch every fence style glide across a real yard{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ---------- Mobile: content below the band ---------- */}
        <div className="absolute inset-x-0 bottom-0 top-[calc(7vh+50vh)] px-5 pt-5 sm:top-[calc(9vh+52vh)] lg:hidden">
          {/* Intro (start of scroll) */}
          <div
            className="absolute inset-x-5 top-6 flex flex-col items-center text-center"
            style={{ opacity: introOpacity }}
          >
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-cream/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur">
              Est. {business.since} · {business.years} years
            </span>
            <h1 className="font-display text-3xl font-semibold leading-[1.06] text-cream drop-shadow-lg">
              Lake County&apos;s Fence Family, Since 1997.
            </h1>
            <span
              className="mt-5 flex flex-col items-center gap-1 text-cream/90"
              style={{ opacity: hintOpacity }}
            >
              <span className="text-[11px] font-medium uppercase tracking-widest">
                Scroll — watch us build it
              </span>
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </span>
          </div>

          {/* CTA (logo-reveal hold) */}
          <div
            className="absolute inset-x-5 top-4 flex flex-col items-center text-center"
            style={{
              opacity: ctaOpacity,
              pointerEvents: ctaOpacity > 0.5 ? "auto" : "none",
            }}
          >
            <div className="flex w-full max-w-xs flex-col items-stretch gap-2.5">
              <Link
                href="/styles#builder"
                className="touch-manipulation rounded-full bg-clay px-6 py-3.5 text-base font-semibold text-cream shadow-lg shadow-black/25"
              >
                Get a Free Estimate
              </Link>
              <a
                href={business.phoneHref}
                className="inline-flex touch-manipulation items-center justify-center gap-2 rounded-full border border-cream/40 bg-cream/10 px-6 py-3.5 text-base font-semibold text-cream backdrop-blur"
              >
                <Phone className="h-4 w-4" /> {business.phone}
              </a>
            </div>
            <Link
              href="/styles"
              className="mt-4 inline-flex touch-manipulation items-center gap-1.5 text-sm font-semibold text-cream/90 underline-offset-4"
            >
              Watch every fence style glide by <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
