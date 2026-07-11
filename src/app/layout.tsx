import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "South Lake Fence — Lake County's Fence Family, Since 1997",
  description:
    "Family-owned fence installation & repair serving Clermont, Winter Garden, Minneola, Groveland & Montverde since 1997. Wood, aluminum, vinyl, chain link, pool-code & commercial fencing. Free estimates.",
  openGraph: {
    title: "South Lake Fence — Built by family. Built to last.",
    description:
      "29 years of fences done right across the South Lake / west-Orlando corridor. Get a free estimate.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
