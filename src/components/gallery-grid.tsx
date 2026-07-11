"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { projects } from "@/lib/site";

const mats = ["All materials", "Wood", "Aluminum", "Vinyl", "Chain link"];

export function GalleryGrid() {
  const [mat, setMat] = useState("All materials");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          mat === "All materials" || p.material.includes(mat.split(" ")[0]),
      ),
    [mat],
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {mats.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setMat(o)}
            className={clsx(
              "touch-manipulation rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
              mat === o
                ? "border-clay bg-clay text-cream"
                : "border-line bg-card text-ink/75 hover:border-clay/40",
            )}
          >
            {o}
          </button>
        ))}
      </div>

      <div className="mt-8 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <figure
            key={p.title}
            className={clsx(
              "group relative overflow-hidden rounded-3xl border border-line bg-card",
              p.span && "sm:col-span-2 sm:row-span-1",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt={`${p.title} — ${p.material} fence`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-grove-deep/80 via-grove-deep/10 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream">
              <p className="font-display text-lg font-semibold">{p.title}</p>
              <p className="text-sm text-cream/80">{p.material}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 rounded-3xl border border-dashed border-line bg-card p-10 text-center text-ink/60">
          No projects match that filter yet — but we&apos;ve almost certainly
          built one. Ask us!
        </p>
      )}
    </div>
  );
}
