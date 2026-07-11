"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  HardHat,
  Landmark,
  Store,
  Timer,
  Ruler,
  KeyRound,
  FileCheck2,
} from "lucide-react";
import { clsx } from "clsx";

/** Commercial "site brief": pick the site, read the spec sheet we'd run. */
const SITES = [
  {
    slug: "construction",
    icon: HardHat,
    label: "Construction site",
    headline: "Perimeter up before the first pour.",
    spec: [
      { k: "Fence", v: "6 ft temporary chain link, driven or stands" },
      { k: "Extras", v: "Privacy screen · vehicle gates · OSHA signage rails" },
      { k: "Mobilized", v: "48–72 hrs from call" },
      { k: "When you're done", v: "We pull it and haul it — no trace" },
    ],
    note: "Rented by the month, moved as your phases move.",
  },
  {
    slug: "community",
    icon: Building2,
    label: "Apartments / HOA",
    headline: "One spec, hundreds of doors, zero board headaches.",
    spec: [
      { k: "Fence", v: "Aluminum perimeter + vinyl privacy interiors" },
      { k: "Extras", v: "Pool-code gates · dumpster corrals · amenity rails" },
      { k: "Approvals", v: "Submittal sheets prepped for your board" },
      { k: "Phasing", v: "Building-by-building, residents undisturbed" },
    ],
    note: "We've fenced whole communities across the corridor since 1997.",
  },
  {
    slug: "retail",
    icon: Store,
    label: "Garden center / retail",
    headline: "Secure after close. Inviting at open.",
    spec: [
      { k: "Fence", v: "Ornamental steel storefront + coated chain link yard" },
      { k: "Extras", v: "Sliding cantilever gates · anti-climb toppers" },
      { k: "Sightlines", v: "Full product visibility, zero fortress vibes" },
      { k: "Install", v: "Nights/off-hours so you never close" },
    ],
    note: "Displays stay visible; shrink doesn't walk off.",
  },
  {
    slug: "government",
    icon: Landmark,
    label: "Government / military",
    headline: "To spec, documented, on schedule.",
    spec: [
      { k: "Fence", v: "High-security steel, anti-climb, crash-rated options" },
      { k: "Extras", v: "Badge/keypad access · automated vehicle gates" },
      { k: "Paperwork", v: "Licensed, insured, full compliance documentation" },
      { k: "Crew", v: "Background-checked, badged, site-briefed" },
    ],
    note: "We've held government and military contracts for years.",
  },
];

export function SiteSpec() {
  const [slug, setSlug] = useState(SITES[0].slug);
  const site = SITES.find((s) => s.slug === slug) ?? SITES[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
      {/* Site picker */}
      <div className="flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {SITES.map((s) => {
          const active = s.slug === slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => setSlug(s.slug)}
              aria-pressed={active}
              className={clsx(
                "flex shrink-0 touch-manipulation items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:px-5",
                active
                  ? "border-gold bg-cream/10 text-cream"
                  : "border-cream/15 text-cream/70 hover:border-cream/35 hover:text-cream",
              )}
            >
              <s.icon
                className={clsx("h-5 w-5 shrink-0", active && "text-gold")}
              />
              <span className="text-sm font-semibold">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Spec sheet */}
      <div className="rounded-3xl border border-cream/15 bg-cream/5 p-6 backdrop-blur sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-md font-display text-2xl font-semibold text-cream sm:text-3xl">
            {site.headline}
          </h3>
          <FileCheck2 className="hidden h-8 w-8 shrink-0 text-gold sm:block" />
        </div>

        <dl className="mt-6 space-y-0 divide-y divide-cream/10">
          {site.spec.map((row, i) => (
            <div
              key={row.k}
              className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-3.5"
            >
              <dt className="flex w-36 shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                {i === 0 && <Ruler className="h-3.5 w-3.5" />}
                {i === 1 && <KeyRound className="h-3.5 w-3.5" />}
                {i === 2 && <Timer className="h-3.5 w-3.5" />}
                {i === 3 && <FileCheck2 className="h-3.5 w-3.5" />}
                {row.k}
              </dt>
              <dd className="min-w-0 flex-1 text-sm text-cream/85 sm:text-base">
                {row.v}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 pt-6">
          <p className="max-w-xs text-sm italic text-cream/60">{site.note}</p>
          <Link
            href={`/styles?type=commercial#builder`}
            className="inline-flex touch-manipulation items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-all hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            Brief us on your site <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
