"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Home,
  Waves,
  Building2,
  Landmark,
  Check,
  Plus,
  Sparkles,
  ArrowRight,
  Ruler,
  PartyPopper,
  Phone,
  MailCheck,
} from "lucide-react";
import { clsx } from "clsx";
import { materials, propertyTypes, business, type Material } from "@/lib/site";
import { addInquiry } from "@/lib/inquiries";

const propIcons: Record<string, typeof Home> = {
  home: Home,
  pool: Waves,
  hoa: Landmark,
  commercial: Building2,
};

export function FenceBuilder() {
  const [propSlug, setPropSlug] = useState(propertyTypes[0].slug);
  const [materialSlug, setMaterialSlug] = useState<string>("wood");
  const [height, setHeight] = useState<number>(6);
  const [gate, setGate] = useState<string>("");
  const [length, setLength] = useState<number>(150);
  const [addOns, setAddOns] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);

  // Preselect from a "Quote this style" slide-in, or from another page's
  // ?type=/?material= link (client-only read, no Suspense needed).
  useEffect(() => {
    const onPick = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (materials.some((m) => m.slug === slug)) setMaterialSlug(slug);
    };
    window.addEventListener("slf:pick-material", onPick);

    const q = new URLSearchParams(window.location.search);
    const t = q.get("type");
    if (t) {
      const p = propertyTypes.find(
        (x) => x.slug === t || x.label.toLowerCase() === t.toLowerCase(),
      );
      if (p) setPropSlug(p.slug);
    }
    const m = q.get("material");
    if (m) {
      const mat = materials.find(
        (x) => x.slug === m || x.name.toLowerCase() === m.toLowerCase(),
      );
      if (mat) setMaterialSlug(mat.slug);
    }
    return () => window.removeEventListener("slf:pick-material", onPick);
  }, []);

  const prop = propertyTypes.find((p) => p.slug === propSlug)!;
  const recommended = prop.recommend;

  const orderedMaterials = useMemo(() => {
    const rec = materials.filter((m) => recommended.includes(m.slug));
    const rest = materials.filter((m) => !recommended.includes(m.slug));
    return [...rec, ...rest];
  }, [recommended]);

  const material: Material =
    materials.find((m) => m.slug === materialSlug) ?? materials[0];

  const validHeight = material.heightsFt.includes(height)
    ? height
    : material.heightsFt[material.heightsFt.length - 1];
  const validGate = material.gates.includes(gate) ? gate : material.gates[0];

  function toggleAddOn(label: string) {
    setAddOns((prev) =>
      prev.includes(label) ? prev.filter((a) => a !== label) : [...prev, label],
    );
  }

  const upsellPicked = addOns.includes(prop.upsell.label);

  const nameOk = name.trim().length > 1;
  const contactOk = phone.trim().length >= 7 || /.+@.+\..+/.test(email.trim());
  const canSubmit = nameOk && contactOk;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!canSubmit) return;
    addInquiry({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      propertyType: prop.label,
      material: material.name,
      height: `${validHeight} ft`,
      gate: validGate,
      length: `~${length} ft`,
      addons: addOns,
      via: "Design-Your-Fence builder",
    });
    setDone(true);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* Controls */}
      <div className="space-y-8">
        <div>
          <StepLabel n={1} title="What are we fencing?" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {propertyTypes.map((p) => {
              const Icon = propIcons[p.slug];
              const active = p.slug === propSlug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setPropSlug(p.slug)}
                  className={clsx(
                    "flex touch-manipulation flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
                    active
                      ? "border-clay bg-clay/5 ring-1 ring-clay"
                      : "border-line bg-card hover:border-clay/40",
                  )}
                >
                  <Icon
                    className={clsx("h-5 w-5", active ? "text-clay" : "text-grove")}
                  />
                  <span className="text-sm font-semibold text-ink">{p.label}</span>
                  <span className="text-xs text-ink/60">{p.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <StepLabel n={2} title="Pick a material" />
          <div className="grid gap-3 sm:grid-cols-2">
            {orderedMaterials.map((m) => {
              const active = m.slug === materialSlug;
              const isRec = recommended.includes(m.slug);
              return (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => setMaterialSlug(m.slug)}
                  className={clsx(
                    "flex touch-manipulation items-center gap-3 overflow-hidden rounded-2xl border p-2.5 pr-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
                    active
                      ? "border-clay bg-clay/5 ring-1 ring-clay"
                      : "border-line bg-card hover:border-clay/40",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.image}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-ink">
                        {m.name}
                      </span>
                      {isRec && (
                        <span className="shrink-0 rounded-full bg-grove/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-grove">
                          Suggested
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink/60">
                      {m.bestFor}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <StepLabel n={3} title="Height" />
            <div className="flex flex-wrap gap-2">
              {material.heightsFt.map((h) => (
                <Chip key={h} active={h === validHeight} onClick={() => setHeight(h)}>
                  {h} ft
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <StepLabel n={4} title="Gate style" />
            <div className="flex flex-wrap gap-2">
              {material.gates.map((g) => (
                <Chip key={g} active={g === validGate} onClick={() => setGate(g)}>
                  {g}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <div>
          <StepLabel n={5} title="Roughly how much fence?" />
          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink/70">
                <Ruler className="h-4 w-4 text-clay" /> Approx. length
              </span>
              <span className="font-semibold text-ink">{length} linear ft</span>
            </div>
            <input
              type="range"
              min={40}
              max={500}
              step={10}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="mt-3 w-full touch-manipulation accent-clay"
              aria-label="Approximate fence length in linear feet"
            />
            <p className="mt-2 text-xs text-ink/50">
              A ballpark is fine — we confirm exact footage on the free on-site
              visit.
            </p>
          </div>
        </div>

        <div>
          <StepLabel n={6} title="Add-ons" />
          <button
            type="button"
            onClick={() => toggleAddOn(prop.upsell.label)}
            className={clsx(
              "mb-3 flex w-full touch-manipulation items-start gap-3 rounded-2xl border-2 border-dashed p-4 text-left transition-all",
              upsellPicked
                ? "border-gold bg-gold/10"
                : "border-gold/50 bg-gold/5 hover:bg-gold/10",
            )}
          >
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                Recommended for {prop.label.toLowerCase()}: {prop.upsell.label}
              </span>
              <span className="mt-0.5 block text-xs text-ink/65">
                {prop.upsell.note}
              </span>
            </span>
            <span
              className={clsx(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                upsellPicked
                  ? "border-gold bg-gold text-ink"
                  : "border-ink/25 text-ink/40",
              )}
            >
              {upsellPicked ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </span>
          </button>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {material.addOns.map((a) => {
              const picked = addOns.includes(a.label);
              return (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => toggleAddOn(a.label)}
                  className={clsx(
                    "flex touch-manipulation items-start gap-2.5 rounded-2xl border p-3.5 text-left transition-all",
                    picked
                      ? "border-clay bg-clay/5"
                      : "border-line bg-card hover:border-clay/40",
                  )}
                >
                  <span
                    className={clsx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                      picked
                        ? "border-clay bg-clay text-cream"
                        : "border-ink/25 text-transparent",
                    )}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ink">
                      {a.label}
                    </span>
                    <span className="block text-xs text-ink/60">{a.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live summary + inline quote submit */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-lg shadow-grove/5">
          <div className="relative h-32 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={material.image}
              alt={material.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-grove-deep/70 to-transparent" />
            <div className="absolute bottom-3 left-4 text-cream">
              <p className="text-xs uppercase tracking-wide text-cream/80">
                Your fence
              </p>
              <p className="font-display text-xl font-semibold">{material.name}</p>
            </div>
          </div>

          {done ? (
            <div className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-grove text-cream">
                <PartyPopper className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-grove">
                Request sent!
              </h3>
              <p className="mt-2 text-sm text-ink/75">
                Thanks, {name.trim().split(" ")[0]} — a real person from South
                Lake Fence will call you back, usually same day, to walk your{" "}
                {material.name.toLowerCase()} and price it exactly.
              </p>
              <div className="mt-4 flex items-start gap-2 rounded-2xl bg-grove/5 px-4 py-3 text-left text-sm text-grove">
                <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  A confirmation&apos;s on its way to{" "}
                  {email.trim() ? email.trim() : "your phone"}, and our team&apos;s
                  been notified.
                </span>
              </div>
              <div className="mt-4 rounded-2xl bg-cream-deep px-4 py-3 text-sm text-ink/70">
                Need it sooner? Call{" "}
                <a href={business.phoneHref} className="font-semibold text-clay">
                  {business.phone}
                </a>
                .
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3 p-6" noValidate>
              <SummaryRow label="For" value={prop.label} />
              <SummaryRow label="Height" value={`${validHeight} ft`} />
              <SummaryRow label="Gate" value={validGate} />
              <SummaryRow label="Length" value={`~${length} linear ft`} />
              {addOns.length > 0 && (
                <div className="border-t border-line pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">
                    Add-ons
                  </p>
                  <ul className="space-y-1.5">
                    {addOns.map((a) => (
                      <li
                        key={a}
                        className="flex items-center gap-2 text-sm text-ink/80"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-clay" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3 border-t border-line pt-4">
                <p className="text-sm font-semibold text-ink">
                  Where do we send your callback?
                </p>
                <div>
                  <label htmlFor="fb-name" className="sr-only">
                    Your name
                  </label>
                  <input
                    id="fb-name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={clsx(
                      "w-full touch-manipulation rounded-xl border bg-cream/40 px-4 py-2.5 text-ink outline-none transition-colors focus:border-clay focus-visible:ring-2 focus-visible:ring-clay/30",
                      tried && !nameOk ? "border-clay" : "border-line",
                    )}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-1">
                  <div>
                    <label htmlFor="fb-phone" className="sr-only">
                      Phone
                    </label>
                    <input
                      id="fb-phone"
                      name="tel"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      spellCheck={false}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone"
                      className={clsx(
                        "w-full touch-manipulation rounded-xl border bg-cream/40 px-4 py-2.5 text-ink outline-none transition-colors focus:border-clay focus-visible:ring-2 focus-visible:ring-clay/30",
                        tried && !contactOk ? "border-clay" : "border-line",
                      )}
                    />
                  </div>
                  <div>
                    <label htmlFor="fb-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="fb-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className={clsx(
                        "w-full touch-manipulation rounded-xl border bg-cream/40 px-4 py-2.5 text-ink outline-none transition-colors focus:border-clay focus-visible:ring-2 focus-visible:ring-clay/30",
                        tried && !contactOk ? "border-clay" : "border-line",
                      )}
                    />
                  </div>
                </div>
                {tried && !canSubmit && (
                  <p className="text-xs font-medium text-clay">
                    Add your name and a phone or email so we can reach you.
                  </p>
                )}
                <p className="text-xs text-ink/50">
                  We only use this to call you back about your fence. Phone{" "}
                  <em>or</em> email — whichever you prefer.
                </p>
              </div>

              <button
                type="submit"
                className="mt-1 flex w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-clay px-6 py-3.5 text-base font-semibold text-cream shadow-sm shadow-clay/30 transition-colors hover:bg-clay-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              >
                Get my free estimate <ArrowRight className="h-4 w-4" />
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-ink/50">
                <Phone className="h-3 w-3" /> No obligation — a real person
                calls you back.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-grove text-xs font-bold text-cream">
        {n}
      </span>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "touch-manipulation rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay",
        active
          ? "border-clay bg-clay text-cream"
          : "border-line bg-card text-ink hover:border-clay/40",
      )}
    >
      {children}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink/55">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
