"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import { clsx } from "clsx";

/**
 * "Will it pass?" — a 60-second self-inspection against Florida's
 * Residential Swimming Pool Safety Act, styled like the inspector's card.
 */
const QUESTIONS = [
  {
    q: "Is the barrier at least 4 feet tall all the way around?",
    hint: "Measured from the outside, finished grade.",
  },
  {
    q: "Would a 4-inch ball fail to fit through any gap?",
    hint: "Between pickets, under the bottom rail — anywhere.",
  },
  {
    q: "Does every gate close itself from any open position?",
    hint: "Let it go from barely-open. It must swing shut and latch.",
  },
  {
    q: "Is the latch release up high, out of a toddler's reach?",
    hint: "And on the pool side of the gate.",
  },
];

export function PassCheck() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );

  const answered = answers.filter((a) => a !== null).length;
  const fails = answers.filter((a) => a === false).length;
  const complete = answered === QUESTIONS.length;

  function set(i: number, v: boolean) {
    setAnswers((prev) => prev.map((a, k) => (k === i ? v : a)));
  }

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-grove/20 bg-card shadow-xl shadow-grove/10">
      {/* Inspector-card header */}
      <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-grove/20 bg-cream/60 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-6 w-6 text-grove" />
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-ink">
              Pool Barrier Self-Inspection
            </p>
            <p className="text-xs uppercase tracking-wide text-ink/50">
              FL Residential Swimming Pool Safety Act · 60 seconds
            </p>
          </div>
        </div>
        <span className="hidden rounded-full bg-grove/10 px-3 py-1 text-xs font-bold text-grove sm:block">
          {answered}/{QUESTIONS.length}
        </span>
      </div>

      <ol className="divide-y divide-line">
        {QUESTIONS.map((item, i) => {
          const a = answers[i];
          return (
            <li key={i} className="flex flex-wrap items-center gap-4 px-6 py-5 sm:px-8">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">
                  <span className="mr-2 font-display text-clay">
                    {i + 1}.
                  </span>
                  {item.q}
                </p>
                <p className="mt-0.5 text-sm text-ink/55">{item.hint}</p>
              </div>
              <div className="flex gap-2" role="group" aria-label={item.q}>
                <button
                  type="button"
                  onClick={() => set(i, true)}
                  aria-pressed={a === true}
                  className={clsx(
                    "touch-manipulation rounded-full border px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grove",
                    a === true
                      ? "border-grove bg-grove text-cream"
                      : "border-line bg-card text-ink hover:border-grove/50",
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => set(i, false)}
                  aria-pressed={a === false}
                  className={clsx(
                    "touch-manipulation rounded-full border px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
                    a === false
                      ? "border-clay bg-clay text-cream"
                      : "border-line bg-card text-ink hover:border-clay/50",
                  )}
                >
                  No / not sure
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Verdict */}
      <div
        aria-live="polite"
        className={clsx(
          "px-6 py-6 sm:px-8",
          complete
            ? fails === 0
              ? "bg-grove text-cream"
              : "bg-clay text-cream"
            : "bg-cream/60",
        )}
      >
        {!complete ? (
          <p className="text-sm text-ink/60">
            Answer all four and we&apos;ll give you the inspector&apos;s
            verdict.
          </p>
        ) : fails === 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 -rotate-6 items-center justify-center rounded-lg border-2 border-cream/70">
                <Stamp className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-2xl font-semibold">
                  Looking compliant.
                </p>
                <p className="text-sm text-cream/85">
                  Nice work. Want a licensed set of eyes to make it official?
                </p>
              </div>
            </div>
            <Link
              href="/styles?type=pool#builder"
              className="touch-manipulation rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-all hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              Book a free code check
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-10 w-10 shrink-0" />
              <div>
                <p className="font-display text-2xl font-semibold">
                  {fails} item{fails > 1 ? "s" : ""} would fail inspection.
                </p>
                <p className="text-sm text-cream/85">
                  Very fixable — usually hardware, not a whole new fence.
                  We&apos;ll make sure you pass.
                </p>
              </div>
            </div>
            <Link
              href="/styles?type=pool#builder"
              className="touch-manipulation rounded-full bg-cream px-6 py-3 text-sm font-semibold text-clay transition-colors hover:bg-cream/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
            >
              Fix it before the inspector sees it
            </Link>
          </div>
        )}
        {complete && (
          <button
            type="button"
            onClick={() => setAnswers(Array(QUESTIONS.length).fill(null))}
            className="mt-4 inline-flex touch-manipulation items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-cream/70 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Start over
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-line bg-cream/40 px-6 py-3 text-xs text-ink/50 sm:px-8">
        <ShieldCheck className="h-4 w-4 shrink-0 text-grove" />
        Self-check for planning only — the real inspection is done by your
        county. We build to pass it, first try.
      </div>
    </div>
  );
}
