import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery-grid";
import { Container, Section, Eyebrow, Button } from "@/components/ui";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Project Gallery | South Lake Fence",
  description:
    "Real fence installations and before/after transformations across the South Lake corridor. Browse by material for inspiration.",
};

export default function GalleryPage() {
  return (
    <Section className="bg-hills pt-14 sm:pt-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal className="max-w-xl">
            <Eyebrow>Project gallery</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-grove sm:text-5xl">
              Inspiration from around the corridor.
            </h1>
            <p className="mt-4 text-pretty text-lg text-ink/75">
              Real installs and real transformations. Pick a material and see
              what it looks like in a real yard.
            </p>
          </Reveal>
          <Reveal>
            <Button href="/styles#builder">Get your project quoted</Button>
          </Reveal>
        </div>

        <div className="mt-10">
          <GalleryGrid />
        </div>
      </Container>
    </Section>
  );
}
