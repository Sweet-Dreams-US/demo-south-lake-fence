import type { Metadata } from "next";
import { Wrench, ShieldCheck, Heart, MapPin } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { MediaSlot } from "@/components/media-slot";
import { Container, Section, Eyebrow, Button } from "@/components/ui";
import { business, voiceLines } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story | South Lake Fence",
  description:
    "Family-owned and operated since 1997. A licensed, insured Florida fencing contractor serving the same South Lake corridor for 29 years — and we repair any fence, even ones we didn't install.",
};

const timeline = [
  { year: "1997", text: "The family sets its first posts in Clermont. One truck, one crew, a handshake and a level." },
  { year: "2000s", text: "Word spreads across the corridor — Winter Garden, Minneola, Groveland, Montverde. Neighbors refer neighbors." },
  { year: "2010s", text: "New subdivisions and pools boom. We add aluminum, vinyl and full pool-code expertise to keep up." },
  { year: "Today", text: "29 years in, second generation on the crew, same phone number, same promise: every post, set right." },
];

export default function AboutPage() {
  return (
    <>
      <Section className="bg-hills pt-14 sm:pt-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Our story</Eyebrow>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-grove sm:text-5xl">
                Lake County&apos;s fence family, since 1997.
              </h1>
              <p className="mt-4 text-pretty text-lg text-ink/75">
                We&apos;re not a franchise and we&apos;re not from out of town.
                For 29 years, the same family has been building and repairing
                fences across the exact same corner of Central Florida — the one
                we call home.
              </p>
              <p className="mt-4 text-pretty text-lg text-ink/75">
                Nobody knows this corridor&apos;s soil, subdivisions, pools and
                HOA rules better. That&apos;s not a slogan — it&apos;s three
                decades of setting posts here.
              </p>
              <div className="mt-6">
                <Button href="/styles#builder">Work with us</Button>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <MediaSlot
                kind="video"
                label="Brand video here"
                note="A short film of the real family crew — drop it in when it's shot."
                className="aspect-[4/3]"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section className="bg-cream">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Heart, title: "Family-owned & operated", body: "The people who answer the phone are the people who build your fence. Always have been." },
              { icon: ShieldCheck, title: "Licensed & insured", body: "A licensed, insured Florida fencing contractor. Permits pulled, code met, inspections passed." },
              { icon: Wrench, title: "We repair any fence", body: "Even ones we didn't install. Storm damage, leaning posts, tired gates — we'll set it right." },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="h-full rounded-3xl border border-line bg-card p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clay/10 text-clay">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-ink/70">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section className="bg-grove-deep text-cream">
        <Container>
          <Reveal className="max-w-xl">
            <Eyebrow className="text-gold">29 years, one corridor</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
              The long way is the only way we know.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 90}>
                <div className="h-full rounded-3xl border border-cream/15 bg-cream/5 p-6">
                  <div className="font-display text-3xl font-semibold text-gold">
                    {t.year}
                  </div>
                  <p className="mt-3 text-sm text-cream/80">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Voice lines */}
      <Section className="bg-cream">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
            {voiceLines.map((v) => (
              <span
                key={v}
                className="font-display text-xl font-semibold text-grove/80 sm:text-2xl"
              >
                {v}
              </span>
            ))}
          </div>
          <Reveal>
            <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-3 rounded-3xl border border-line bg-card p-8 text-center">
              <MapPin className="h-6 w-6 text-clay" />
              <p className="text-ink/75">{business.address}</p>
              <p className="font-display text-2xl font-semibold text-grove">
                {business.tagline}
              </p>
              <Button href="/styles#builder" className="mt-2">
                Get a Free Estimate
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
