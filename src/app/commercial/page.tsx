import type { Metadata } from "next";
import { ShieldCheck, Timer, Building2 } from "lucide-react";
import { SiteSpec } from "@/components/site-spec";
import { Reveal } from "@/components/reveal";
import { Container, Section, Eyebrow, Button } from "@/components/ui";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Commercial Fencing — Pick Your Site, Read the Spec | South Lake Fence",
  description:
    "Construction sites, apartment communities, retail yards, and government facilities. Pick your site type and read the exact spec we'd run — mobilized in days, documented, done right.",
};

const proof = [
  { icon: Timer, stat: "48–72h", label: "Temporary fence mobilization" },
  { icon: Building2, stat: "Whole-community", label: "HOA & apartment phasing" },
  { icon: ShieldCheck, stat: "Gov/military", label: "Contract-cleared crews" },
];

export default function CommercialPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-cream pt-14 sm:pt-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Commercial fencing</Eyebrow>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.02] text-grove sm:text-6xl">
                Tell us the site.
                <br />
                <span className="text-clay">We&apos;ll bring the spec.</span>
              </h1>
              <p className="mt-5 max-w-md text-pretty text-lg text-ink/75">
                Jobsite perimeters, whole communities, retail yards, secure
                facilities — 29 years of commercial work across Central
                Florida, from a crew that shows up when the schedule says so.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                {proof.map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3"
                  >
                    <p.icon className="h-5 w-5 shrink-0 text-clay" />
                    <span>
                      <span className="block font-display text-lg font-semibold leading-tight text-ink">
                        {p.stat}
                      </span>
                      <span className="block text-xs text-ink/60">
                        {p.label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="overflow-hidden rounded-3xl border border-line shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media.commercial}
                  alt="Temporary chain-link construction fencing at a Central Florida homebuilding site"
                  className="w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* The site brief — interactive spec sheet */}
      <Section className="bg-grove-deep text-cream">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow className="text-gold">The site brief</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Pick your site. Read the spec we&apos;d run.
            </h2>
            <p className="mt-4 text-cream/70">
              No two sites get the same fence. Here&apos;s exactly how we&apos;d
              scope yours — down to mobilization and paperwork.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <SiteSpec />
          </Reveal>
        </Container>
      </Section>

      {/* Closer */}
      <Section className="bg-cream">
        <Container>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-card p-8 sm:flex-row sm:items-center sm:p-10">
              <div>
                <h3 className="font-display text-2xl font-semibold text-grove sm:text-3xl">
                  Have plans, a bid deadline, or just an acreage number?
                </h3>
                <p className="mt-2 text-ink/70">
                  Send whatever you have — we&apos;ll turn it into a real
                  number fast.
                </p>
              </div>
              <Button href="/styles?type=commercial#builder" size="lg">
                Brief us on your site
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
