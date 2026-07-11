"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { business, nav } from "@/lib/site";
import { media } from "@/lib/media";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 transition-colors duration-300",
          scrolled || open
            ? "bg-cream/95 backdrop-blur border-b border-line shadow-sm"
            : "bg-cream/70 backdrop-blur-sm border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-8">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center"
            aria-label={business.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.logoNav}
              alt=""
              className="w-40 object-contain sm:w-56"
              width={1000}
              height={80}
            />
            <span className="sr-only">{business.name}</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-clay",
                  pathname === item.href ? "text-clay" : "text-ink/80",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={business.phoneHref}
              className="hidden items-center gap-1.5 text-sm font-semibold text-grove hover:text-clay sm:flex"
            >
              <Phone className="h-4 w-4" />
              {business.phone}
            </a>
            <Link
              href="/styles#builder"
              className="rounded-full bg-clay px-4 py-2 text-xs font-semibold text-cream shadow-sm shadow-clay/30 transition-colors hover:bg-clay-dark sm:text-sm"
            >
              Free Estimate
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 touch-manipulation items-center justify-center rounded-full border border-line text-grove focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile side drawer — rendered outside the blurred header so `fixed`
          anchors to the viewport, not the header box */}
      <div className="lg:hidden">
        {/* Scrim: dims but keeps the page visible behind the drawer */}
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={clsx(
            "fixed inset-0 z-[60] bg-grove-deep/45 backdrop-blur-[1px] transition-opacity duration-300",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />

        {/* The drawer itself — ~60% width, slides in from the right */}
        <aside
          id="mobile-drawer"
          aria-hidden={!open}
          className={clsx(
            "fixed right-0 top-0 z-[61] flex h-[100dvh] w-[60%] max-w-[18rem] flex-col border-l border-line bg-cream shadow-2xl transition-[translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-line px-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media.logoNav} alt="" className="w-32 object-contain" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 touch-manipulation items-center justify-center rounded-full border border-line text-grove focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={open ? 0 : -1}
                className={clsx(
                  "rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                  pathname === item.href
                    ? "bg-clay/10 text-clay"
                    : "text-ink hover:bg-cream-deep",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-2 border-t border-line p-3">
            <Link
              href="/styles#builder"
              tabIndex={open ? 0 : -1}
              className="flex items-center justify-center gap-2 rounded-xl bg-clay px-4 py-3 text-[15px] font-semibold text-cream"
            >
              Free Estimate <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={business.phoneHref}
              tabIndex={open ? 0 : -1}
              className="flex items-center justify-center gap-2 rounded-xl bg-grove px-4 py-3 text-[15px] font-semibold text-cream"
            >
              <Phone className="h-4 w-4" /> {business.phone}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
