import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { business, nav, serviceArea } from "@/lib/site";
import { media } from "@/lib/media";

export function SiteFooter() {
  return (
    <footer className="bg-grove-deep text-cream/85">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.logoFooter}
              alt={business.name}
              className="mb-5 h-28 w-auto"
              width={180}
              height={194}
            />
            <p className="max-w-sm text-sm leading-relaxed text-cream/70">
              Family-owned fence installation & repair serving the South Lake /
              west-Orlando corridor since {business.since}.{" "}
              <span className="text-gold">{business.tagline}</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {serviceArea.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-cream">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-gold">
                  Home
                </Link>
              </li>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/styles#builder" className="hover:text-gold">
                  Get a Free Estimate
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-cream/45 hover:text-gold">
                  Owner Dashboard →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-lg text-cream">Get in touch</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={business.phoneHref}
                  className="flex items-center gap-2.5 hover:text-gold"
                >
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  {business.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-2.5 break-all hover:text-gold"
                >
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  {business.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {business.address}
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  {business.hours.map((h) => (
                    <span key={h.d} className="block">
                      {h.d}: {h.h}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/12 pt-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {business.since}–2026 {business.legalName}. Licensed & insured
            Florida fencing contractor.
          </p>
          <p className="text-cream/40">
            Demo site by Sweet Dreams — sample content, not a live storefront.
          </p>
        </div>
      </div>
    </footer>
  );
}
