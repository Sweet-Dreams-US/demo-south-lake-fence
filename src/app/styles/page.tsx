import type { Metadata } from "next";
import { Check } from "lucide-react";
import { FenceBuilder } from "@/components/fence-builder";
import { StylesFilm } from "@/components/styles-film";
import { Reveal } from "@/components/reveal";
import { Container, Section, Eyebrow } from "@/components/ui";
import { materials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fence Styles & Materials — Design Your Fence | South Lake Fence",
  description:
    "Watch every fence style slide across a real Central Florida yard, then design yours: wood, aluminum, vinyl/PVC, chain link and wrought iron, with a free pre-filled estimate.",
};

export default function StylesPage() {
  return (
    <>
      {/* The fence-material film: same yard, five fences */}
      <StylesFilm />

      <Section
        id="builder"
        className="scroll-mt-16 bg-hills pt-14 sm:pt-20"
      >
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>Get your free estimate</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-grove sm:text-5xl">
              Design it, send it, get a callback.
            </h1>
            <p className="mt-4 text-pretty text-lg text-ink/75">
              Pick what you&apos;re fencing, the material, height and gate, drop
              your name and number — and a real person from South Lake Fence
              calls you back, usually same day, to price it exactly. Right here,
              no separate forms.
            </p>
          </Reveal>

          <div className="mt-12">
            <FenceBuilder />
          </div>
        </Container>
      </Section>

      {/* Full catalog */}
      <Section className="bg-cream">
        <Container>
          <Reveal className="max-w-xl">
            <Eyebrow>The full catalog</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-grove sm:text-4xl">
              Every material we install and repair.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-6">
            {materials.map((m, i) => (
              <Reveal key={m.slug} delay={i * 60}>
                <div className="grid overflow-hidden rounded-3xl border border-line bg-card md:grid-cols-[1fr_1.4fr]">
                  <div className="relative min-h-56 overflow-hidden md:min-h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {m.tag && (
                      <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-7 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-2xl font-semibold text-ink">
                        {m.name}
                      </h3>
                      {m.tag && (
                        <span className="rounded-full bg-cream-deep px-3 py-1 text-sm font-semibold text-grove">
                          {m.tag}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-ink/75">{m.blurb}</p>
                    <p className="mt-3 text-sm font-medium text-clay">
                      {m.bestFor}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                          Heights
                        </p>
                        <p className="mt-1 text-sm text-ink/80">
                          {m.heightsFt.map((h) => `${h} ft`).join(" · ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                          Popular add-ons
                        </p>
                        <ul className="mt-1 space-y-1">
                          {m.addOns.map((a) => (
                            <li
                              key={a.label}
                              className="flex items-center gap-1.5 text-sm text-ink/80"
                            >
                              <Check className="h-3.5 w-3.5 shrink-0 text-clay" />
                              {a.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
