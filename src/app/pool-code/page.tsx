import type { Metadata } from "next";
import { Check, DoorClosed, Ruler, Baby, DoorOpen, Grid3X3 } from "lucide-react";
import { PassCheck } from "@/components/pass-check";
import { Reveal } from "@/components/reveal";
import { Container, Section, Eyebrow, Button } from "@/components/ui";
import { PostRail } from "@/components/post-rail";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Pool Fencing & Florida Code — Will Yours Pass? | South Lake Fence",
  description:
    "Take the 60-second pool-barrier self-inspection, see Florida's pool-safety rules in plain English, and let us make sure you pass the real inspection the first time.",
};

const rules = [
  {
    icon: Ruler,
    stat: "48″",
    title: "minimum height",
    body: "Four feet, measured on the outside from finished grade.",
  },
  {
    icon: Grid3X3,
    stat: "<4″",
    title: "maximum gap",
    body: "A 4-inch sphere can't pass anywhere — pickets, rails, or under.",
  },
  {
    icon: DoorOpen,
    stat: "Self-close",
    title: "every gate",
    body: "Swings shut and latches on its own, from any open position.",
  },
  {
    icon: Baby,
    stat: "54″",
    title: "latch height",
    body: "Release sits high on the pool side — out of little hands' reach.",
  },
];

export default function PoolCodePage() {
  return (
    <>
      {/* Hero — the inspection, made boring */}
      <Section className="bg-grove-deep pt-14 text-cream sm:pt-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <Eyebrow className="text-gold">Pool fencing &amp; FL code</Eyebrow>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.02] sm:text-6xl">
                The inspector is coming.
                <br />
                <span className="text-sky">Let&apos;s make it boring.</span>
              </h1>
              <p className="mt-5 max-w-md text-pretty text-lg text-cream/80">
                Florida law requires a self-closing, self-latching barrier
                around every residential pool. New pool, new house, new baby —
                whatever brought you here, we build to the code and you pass the
                first time.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="#self-check" variant="gold" size="lg">
                  Take the 60-second self-check
                </Button>
                <Button href="/styles?type=pool#builder" variant="ghost" size="lg" className="border-cream/30 text-cream hover:bg-cream/10">
                  Skip to a quote
                </Button>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative overflow-hidden rounded-3xl border border-cream/15 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.pool}
                  alt="Black aluminum pool fence with a self-latching safety gate"
                  className="w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-sky px-3 py-1 text-xs font-bold uppercase tracking-wide text-grove-deep">
                  Code-compliant
                </span>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* The four numbers that matter */}
      <Section className="bg-cream">
        <Container>
          <Reveal className="max-w-xl">
            <Eyebrow>The rules, in four numbers</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold text-grove sm:text-4xl">
              Everything the inspector measures.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {rules.map((r, i) => (
              <Reveal key={r.title} delay={i * 70} className="h-full">
                <div className="flex h-full flex-col bg-card p-6">
                  <r.icon className="h-6 w-6 text-sky" />
                  <p className="mt-5 font-display text-4xl font-semibold leading-none text-grove">
                    {r.stat}
                  </p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-clay">
                    {r.title}
                  </p>
                  <p className="mt-2.5 text-sm text-ink/70">{r.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* The self-check */}
      <Section id="self-check" className="bg-hills">
        <Container>
          <Reveal className="mx-auto max-w-xl text-center">
            <PostRail className="text-clay/60" />
            <h2 className="mt-6 font-display text-3xl font-semibold text-grove sm:text-4xl">
              Will yours pass? Grade it yourself.
            </h2>
            <p className="mt-3 text-ink/70">
              Walk out to the pool, answer four questions honestly.
            </p>
          </Reveal>
          <Reveal delay={100} className="mx-auto mt-10 max-w-3xl">
            <PassCheck />
          </Reveal>
        </Container>
      </Section>

      {/* Safe ≠ ugly */}
      <Section className="bg-cream">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-line bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.pool}
                  alt="Code-compliant pool fence style"
                  loading="lazy"
                  className="w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Eyebrow>Pool-safe styles</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-semibold text-grove sm:text-4xl">
                Safe doesn&apos;t have to mean ugly.
              </h2>
              <ul className="mt-6 space-y-3">
                {[
                  "Powder-coated aluminum — rust-proof, see-through, keeps the view.",
                  "Self-closing, self-latching hardware built in — not bolted on later.",
                  "Puppy-picket bottom rail keeps small pets in, too.",
                  "Wrought-iron upgrade for estates and custom entrances.",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
                    <span className="text-ink/80">{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Button href="/styles?type=pool#builder">
                  <DoorClosed className="h-4 w-4" /> Start my pool fence
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
