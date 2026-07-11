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
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-grove-deep">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-grove-deep/45 via-transparent to-grove-deep/70" />

        {/* Intro */}
        <div
          className="absolute inset-x-0 top-[18%] flex flex-col items-center px-6 text-center"
          style={{ opacity: introOpacity }}
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur">
            Est. {business.since} · {business.years} years
          </span>
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] text-cream drop-shadow-lg sm:text-6xl md:text-7xl">
            Lake County&apos;s Fence Family,
            <br className="hidden sm:block" /> Since 1997.
          </h1>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-1 text-cream/90"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-xs font-medium uppercase tracking-widest">
            Scroll — watch us build it
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>

        {/* Logo hold — CTAs, stays visible into the handoff */}
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
              className="touch-manipulation rounded-full bg-clay px-7 py-3.5 text-base font-semibold text-cream shadow-lg shadow-black/25 transition-colors hover:bg-clay-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Get a Free Estimate
            </Link>
            <a
              href={business.phoneHref}
              className="inline-flex touch-manipulation items-center gap-2 rounded-full border border-cream/40 bg-cream/10 px-6 py-3.5 text-base font-semibold text-cream backdrop-blur transition-colors hover:bg-cream/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Phone className="h-4 w-4" /> {business.phone}
            </a>
          </div>
          <Link
            href="/styles"
            className="mt-5 inline-flex touch-manipulation items-center gap-1.5 text-sm font-semibold text-cream/90 underline-offset-4 transition-colors hover:text-gold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Watch every fence style glide across a real yard{" "}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
