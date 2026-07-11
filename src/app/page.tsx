import Link from "next/link";
import { ArrowRight, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { ScrollHero } from "@/components/scroll-hero";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { CountUp } from "@/components/count-up";
import { PostRail } from "@/components/post-rail";
import { Reveal } from "@/components/reveal";
import { Container, Section, Eyebrow, Button } from "@/components/ui";
import {
  business,
  stats,
  differentiators,
  floridaPillars,
  testimonials,
  serviceArea,
} from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <ScrollHero />

      {/* Styles teaser — no spoilers, just the itch to see it */}
      <section className="relative bg-grove-deep pb-20 text-cream sm:pb-28">
        <Container>
          <Reveal className="mx-auto max-w-3xl pt-10 text-center sm:pt-14">
            <Eyebrow className="justify-center text-gold">
              The styles
            </Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.02] sm:text-6xl">
              We put five fences
              <br /> in the same backyard.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-lg text-cream/70">
              Wood, aluminum, vinyl, chain link, wrought iron — one yard, one
              scroll. You&apos;ve never shopped a fence like this.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {["Wood", "Aluminum", "Vinyl", "Chain Link", "Wrought Iron"].map(
                (n) => (
                  <span
                    key={n}
                    className="rounded-full border border-cream/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-cream/70"
                  >
                    {n}
                  </span>
                ),
              )}
            </div>
            <div className="mt-9">
              <Link
                href="/styles"
                className="group inline-flex touch-manipulation items-center gap-2.5 rounded-full bg-gold px-8 py-4 text-base font-semibold text-ink shadow-lg shadow-black/25 transition-all hover:gap-4 hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                See it for yourself <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-3 text-xs uppercase tracking-widest text-cream/45">
                30 seconds · worth it
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-14">
            <dl className="mx-auto grid max-w-3xl grid-cols-2 gap-6 border-t border-cream/10 pt-10 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-4xl font-semibold leading-none text-gold">
                    <CountUp value={s.n} />
                  </dd>
                  <dd className="mt-1.5 text-xs font-medium uppercase tracking-wide text-cream/55">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* Florida is different — editorial numbered */}
      <Section className="bg-cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <Eyebrow>The Florida part</Eyebrow>
                <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-grove sm:text-4xl">
                  A fence here has three jobs a fence up north never gets.
                </h2>
                <p className="mt-4 text-pretty text-ink/70">
                  We&apos;ve been getting all three right, for the same towns,
                  since 1997.
                </p>
                <Button href="/pool-code" variant="ghost" className="mt-6">
                  Pool code, in plain English <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>

            <div>
              {floridaPillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <div className="group relative border-t border-line py-8 pl-20 last:border-b sm:py-10 sm:pl-28">
                    <span
                      aria-hidden
                      className="absolute left-0 top-7 font-display text-5xl font-semibold leading-none text-clay/25 transition-colors group-hover:text-clay/50 sm:top-9 sm:text-6xl"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-ink/70">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Before / after — interactive drag */}
      <Section className="bg-grove-deep text-cream">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <Eyebrow className="text-gold">The repair promise</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-5xl">
                We repair any fence.
                <br />
                <span className="text-gold">Even ones we didn&apos;t build.</span>
              </h2>
              <p className="mt-5 max-w-md text-lg text-cream/75">
                Storm damage, gray rot, a leaning line from another crew —
                doesn&apos;t matter. Drag the handle and see what one visit
                does.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Same-week storm repairs",
                  "Any brand, any material",
                  "Posts reset in concrete, not patched",
                ].map((s) => (
                  <li key={s} className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-gold" />
                    <span className="text-cream/85">{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/styles#builder" variant="gold" size="lg">
                  Book a repair visit
                </Button>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <BeforeAfterSlider />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Neighbors marquee */}
      <section className="overflow-hidden bg-cream py-16 sm:py-20">
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Good fences, great neighbors</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-semibold text-grove sm:text-4xl">
                Two decades of word of mouth.
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-gold">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="h-5 w-5 fill-current" />
              ))}
              <span className="ml-2 text-sm font-semibold text-ink/70">
                4.8 across the corridor
              </span>
            </div>
          </Reveal>
        </Container>

        <div className="marquee relative mt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-32"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-32"
          />
          <div className="marquee-track flex w-max gap-5 motion-reduce:w-full motion-reduce:flex-wrap">
            {[...testimonials, ...testimonials].map((t, i) => (
              <figure
                key={i}
                aria-hidden={i >= testimonials.length}
                className="w-[19rem] shrink-0 rounded-3xl border border-line bg-card p-6 sm:w-[23rem]"
              >
                <blockquote className="text-pretty text-base leading-relaxed text-ink/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="text-ink/55">{t.town}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <Container>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
            {differentiators.map((d, i) => (
              <span
                key={d.title}
                className="flex items-center gap-6 text-sm font-semibold uppercase tracking-wide text-grove/70"
              >
                {d.title}
                {i < differentiators.length - 1 && (
                  <span aria-hidden className="h-1 w-1 rounded-full bg-clay/50" />
                )}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Hometown */}
      <Section className="bg-hills">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Hometown radius</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-grove sm:text-4xl">
                If you can see the Citrus Tower,
                <br /> you&apos;re in our yard.
              </h2>
              <p className="mt-4 max-w-md text-lg text-ink/75">
                The South Lake corridor is one of the fastest-growing new-home
                markets in Central Florida — and we&apos;ve fenced it town by
                town since {business.since}.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {serviceArea.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-medium text-grove"
                  >
                    <MapPin className="h-3.5 w-3.5 text-clay" />
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-lg shadow-grove/5">
                <iframe
                  title="South Lake Fence service area — Clermont, Winter Garden, Minneola, Groveland, Montverde and Ocoee"
                  src="https://www.google.com/maps?q=Montverde,+FL&z=11&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="aspect-[4/3] w-full border-0"
                />
                <p className="border-t border-line bg-cream/50 px-4 py-2.5 text-center text-xs text-ink/55">
                  Home base: {business.address}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="bg-clay text-cream">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <PostRail className="text-cream/70" />
            <h2 className="mt-8 font-display text-4xl font-semibold leading-[1.02] sm:text-6xl">
              Every post, set right.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-cream/85">
              Free estimates across the corridor. {business.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/styles#builder" variant="dark" size="lg">
                Get a Free Estimate
              </Button>
              <a
                href={business.phoneHref}
                className="inline-flex touch-manipulation items-center gap-2 rounded-full border border-cream/40 px-6 py-3.5 text-base font-semibold text-cream transition-colors hover:bg-cream/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <Phone className="h-4 w-4" /> {business.phone}
              </a>
            </div>
            <PostRail className="mt-8 text-cream/70" />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
