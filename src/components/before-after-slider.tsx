"use client";

import { useState } from "react";
import { GripVertical } from "lucide-react";
import { media } from "@/lib/media";

/**
 * Drag comparison of two perfectly-registered photos of the same yard —
 * the aged fence and the repaired one — driven by an accessible range input.
 */
export function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative">
      <div className="relative aspect-[3/2] select-none overflow-hidden rounded-3xl border border-cream/15 shadow-2xl">
        {/* AFTER — base layer */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={media.repairAfter}
          alt="The same fence after repair — new stained cedar"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* BEFORE — clipped by the handle */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.repairBefore}
            alt="Weathered, leaning fence — before"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Divider + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-cream shadow-[0_0_12px_rgba(0,0,0,0.45)]"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-grove shadow-lg">
            <GripVertical className="h-5 w-5" />
          </span>
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-grove-deep/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream backdrop-blur">
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 z-10 rounded-full bg-gold/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
          After
        </span>

        {/* Range input drives it — keyboard + touch accessible */}
        <input
          type="range"
          min={2}
          max={98}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Reveal the before and after comparison"
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize touch-manipulation appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold"
        />
      </div>
      <p className="mt-3 text-center text-xs font-medium uppercase tracking-widest text-cream/60">
        Drag — storm-worn to brand-new. Same fence line, one visit.
      </p>
    </div>
  );
}
