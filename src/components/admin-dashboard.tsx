"use client";

import { useEffect, useState } from "react";
import { getInquiries, timeAgo, type Inquiry } from "@/lib/inquiries";
import {
  LayoutDashboard,
  Hammer,
  FileText,
  CalendarDays,
  Users,
  Boxes,
  BarChart3,
  Receipt,
  Share2,
  Settings,
  TrendingUp,
  Inbox,
  Lock,
  Mail,
  MailCheck,
  MailOpen,
  Paperclip,
  Phone,
  MapPin,
  DollarSign,
  Star,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { clsx } from "clsx";
import { business } from "@/lib/site";
import { media } from "@/lib/media";

// Live for the demo: inquiries in, estimates out.
const liveTabs = [
  { key: "Inquiries", icon: Inbox },
  { key: "Estimates", icon: Mail },
];

// Visible but locked — the full-platform upsell.
const lockedTabs = [
  { key: "Dashboard", icon: LayoutDashboard },
  { key: "Jobs", icon: Hammer },
  { key: "Schedule", icon: CalendarDays },
  { key: "Staff", icon: Users },
  { key: "Materials", icon: Boxes },
  { key: "Analytics", icon: BarChart3 },
  { key: "Accounting", icon: Receipt },
  { key: "Socials", icon: Share2 },
  { key: "Settings", icon: Settings },
];

export function AdminDashboard() {
  const [tab, setTab] = useState("Inquiries");
  const isLocked = lockedTabs.some((t) => t.key === tab);

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col gap-4 lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-60 lg:shrink-0">
        <div className="px-2 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.logoNav} alt="" className="h-4 w-auto" />
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink/50">
            Owner Portal
          </p>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {liveTabs.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={clsx(
                  "flex shrink-0 touch-manipulation items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grove",
                  active ? "bg-grove text-cream" : "text-ink/75 hover:bg-cream-deep",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.key}
              </button>
            );
          })}

          <div className="mx-3.5 mt-4 hidden items-center gap-2 border-t border-line pt-4 lg:flex">
            <Lock className="h-3 w-3 text-ink/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">
              Full platform
            </span>
          </div>

          {lockedTabs.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={clsx(
                  "flex shrink-0 touch-manipulation items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grove",
                  active
                    ? "bg-cream-deep text-ink/70"
                    : "text-ink/45 hover:bg-cream-deep/60",
                )}
              >
                <t.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{t.key}</span>
                <Lock className="h-3.5 w-3.5 text-ink/35" />
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1 rounded-3xl border border-line bg-card p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-ink">
            {tab}
            {isLocked && <Lock className="h-5 w-5 text-ink/40" />}
          </h2>
          <span className="hidden items-center gap-2 rounded-full bg-cream-deep px-3 py-1.5 text-xs font-medium text-ink/60 sm:flex">
            <Clock className="h-3.5 w-3.5" /> Demo data · updated just now
          </span>
        </div>

        {tab === "Inquiries" && <InquiriesTab />}
        {tab === "Estimates" && <EstimatesTab />}
        {isLocked && <LockedTab tab={tab} />}
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */
function Kpi({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: typeof DollarSign;
}) {
  return (
    <div className="rounded-2xl border border-line bg-cream/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink/50">
          {label}
        </span>
        <Icon className="h-4 w-4 text-clay" />
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
      {delta && (
        <p className="mt-1 flex items-center gap-1 text-xs font-medium text-grove">
          <TrendingUp className="h-3.5 w-3.5" /> {delta}
        </p>
      )}
    </div>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = {
    New: "bg-sky/15 text-sky",
    "Called back": "bg-gold/20 text-clay",
    "Visit booked": "bg-grove/12 text-grove",
    Drafting: "bg-cream-deep text-ink/60",
    Emailed: "bg-sky/15 text-sky",
    Opened: "bg-gold/20 text-clay",
    Accepted: "bg-grove/12 text-grove",
    Scheduled: "bg-sky/15 text-sky",
    "In progress": "bg-gold/20 text-clay",
    Complete: "bg-grove/12 text-grove",
    Paid: "bg-grove/12 text-grove",
    Deposit: "bg-gold/20 text-clay",
    Due: "bg-clay/12 text-clay",
  };
  return (
    <span
      className={clsx(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        map[s] ?? "bg-cream-deep text-ink/60",
      )}
    >
      {s}
    </span>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-cream/50 text-xs uppercase tracking-wide text-ink/50">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-cream/30">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3 text-ink/80">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- LIVE: Inquiries in ---------- */
function InquiriesTab() {
  const [live, setLive] = useState<Inquiry[]>([]);

  useEffect(() => {
    const load = () => setLive(getInquiries());
    load();
    window.addEventListener("slf:inquiry-added", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("slf:inquiry-added", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const seed: React.ReactNode[][] = [
    ["Dana R. · Winter Garden", "Aluminum pool fence quote", "Styles film → Quote this style", "2h ago", <StatusPill key="s" s="New" />],
    ["Mike & Carol T. · Groveland", "Storm repair — 40 ft down", "Design-Your-Fence builder", "Yesterday", <StatusPill key="s" s="Called back" />],
    ["Oak Grove HOA", "Community perimeter walk-through", "Commercial page — site brief", "Yesterday", <StatusPill key="s" s="Visit booked" />],
    ["Priya S. · Montverde", "Wood privacy, pool-code check", "Pool self-inspection → fix it", "2 days ago", <StatusPill key="s" s="Visit booked" />],
    ["J. Barnett · Groveland", "Wrought iron entrance", "Phone call", "3 days ago", <StatusPill key="s" s="Called back" />],
  ];

  const liveRows: React.ReactNode[][] = live.map((q) => [
    <span key="n" className="flex items-center gap-2">
      <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-clay" />
      <span className="font-semibold text-ink">{q.name}</span>
    </span>,
    `${q.material} · ${q.height}${q.addons.length ? ` · +${q.addons.length}` : ""}`,
    q.via,
    timeAgo(q.createdAt),
    <StatusPill key="s" s="New" />,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi
          label="New this week"
          value={String(11 + live.length)}
          delta={live.length ? `+${live.length} just now` : "+4 vs last week"}
          icon={Inbox}
        />
        <Kpi label="Awaiting callback" value={String(3 + live.length)} icon={Phone} />
        <Kpi label="Visits booked" value="5" delta="from inquiries" icon={CheckCircle2} />
      </div>

      {live.length > 0 && (
        <div className="flex items-start gap-2 rounded-2xl border border-clay/30 bg-clay/5 px-4 py-3 text-sm text-clay">
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">
              {live.length} quote{live.length > 1 ? "s" : ""} just came in from
              the site
            </span>{" "}
            — a real build emails the customer their confirmation and pings the
            team. (Emails are disabled in this demo.)
          </span>
        </div>
      )}

      <Table
        head={["From", "Wants", "Came in via", "Received", "Status"]}
        rows={[...liveRows, ...seed]}
      />

      <p className="flex items-center gap-2 rounded-2xl bg-grove/5 px-4 py-3 text-sm text-grove">
        <Phone className="h-4 w-4 shrink-0" />
        Every inquiry gets a same-day callback from a real person — that&apos;s
        the close.
      </p>
    </div>
  );
}

/* ---------- LIVE: Estimates out via email ---------- */
function EstimatesTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Sent this month" value="23" delta="61% accepted" icon={Send} />
        <Kpi label="Opened, not signed" value="4" icon={MailOpen} />
        <Kpi label="Drafts ready" value="2" icon={FileText} />
      </div>

      {/* Outgoing email mock */}
      <div className="overflow-hidden rounded-2xl border border-line">
        <div className="flex items-center justify-between border-b border-line bg-cream/50 px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Next up · EST-2044
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-clay px-3.5 py-1.5 text-xs font-semibold text-cream">
            <Send className="h-3.5 w-3.5" /> Send estimate
          </span>
        </div>
        <div className="space-y-2 px-4 py-4 text-sm">
          <p>
            <span className="mr-2 text-ink/45">To:</span>
            <span className="font-medium text-ink">dana.r@email.com</span>
          </p>
          <p>
            <span className="mr-2 text-ink/45">Subject:</span>
            <span className="font-medium text-ink">
              Your South Lake Fence estimate — aluminum pool fence
            </span>
          </p>
          <p className="text-ink/70">
            Hi Dana — great walking your yard yesterday. Attached is your
            itemized estimate, good for 30 days. Questions? Call{" "}
            {business.phone} and ask for Ray.
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-cream/60 px-3 py-1.5 text-xs font-medium text-ink/70">
            <Paperclip className="h-3.5 w-3.5" /> EST-2044-aluminum-pool.pdf
          </span>
        </div>
      </div>

      <Table
        head={["Estimate", "Customer", "Project", "Emailed to", "Sent", "Status"]}
        rows={[
          ["EST-2044", "Dana R.", "Aluminum pool fence", "dana.r@email.com", "—", <StatusPill key="s" s="Drafting" />],
          ["EST-2043", "M. Chen", "Vinyl + drive gate", "mchen@email.com", "—", <StatusPill key="s" s="Drafting" />],
          ["EST-2041", "Alvarez family", "Vinyl privacy, 210 ft", "alvarez.fam@email.com", "Tue", <StatusPill key="s" s="Opened" />],
          ["EST-2040", "Oak Grove HOA", "Community perimeter", "board@oakgrovehoa.org", "Mon", <StatusPill key="s" s="Emailed" />],
          ["EST-2039", "Mike & Carol T.", "Storm repair, 40 ft", "mct@email.com", "Mon", <StatusPill key="s" s="Accepted" />],
          ["EST-2036", "J. Barnett", "Wrought iron entrance", "jbarnett@email.com", "Last wk", <StatusPill key="s" s="Accepted" />],
        ]}
      />

      <p className="flex items-center gap-2 rounded-2xl bg-grove/5 px-4 py-3 text-sm text-grove">
        <MailCheck className="h-4 w-4 shrink-0" />
        Estimates go out as clean, itemized PDFs from your own email — opens
        and acceptances tracked right here.
      </p>
    </div>
  );
}

/* ---------- Locked preview + upsell ---------- */
const lockedPreviews: Record<string, string[]> = {
  Dashboard: ["Revenue at a glance", "Today's crew routes", "Pipeline value"],
  Jobs: ["Active installs & repairs", "Crew assignments", "Job status board"],
  Schedule: ["Crews × properties × dates", "Drag-and-drop rescheduling", "Weather flags"],
  Staff: ["Roster & licensing", "Crew leads", "Training records"],
  Materials: ["Style & material catalog", "Pricing templates", "Stock alerts"],
  Analytics: ["Quote-to-close rate", "Material mix", "Service-area heat map"],
  Accounting: ["Invoicing & deposits", "A/R aging", "QuickBooks sync"],
  Socials: ["Facebook & Yelp reviews", "Auto review requests", "Post scheduler"],
  Settings: ["Business profile", "License & insurance", "Team permissions"],
};

function LockedTab({ tab }: { tab: string }) {
  const bullets = lockedPreviews[tab] ?? [];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line">
      {/* Blurred teaser rows */}
      <div
        aria-hidden
        className="pointer-events-none select-none space-y-3 p-6 blur-[3px]"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {bullets.map((b) => (
            <div key={b} className="rounded-2xl border border-line bg-cream/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
                {b}
              </p>
              <div className="mt-3 h-3 w-2/3 rounded bg-cream-deep" />
              <div className="mt-2 h-3 w-1/2 rounded bg-cream-deep" />
            </div>
          ))}
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-line px-4 py-3">
            <div className="h-8 w-8 rounded-full bg-cream-deep" />
            <div className="h-3 flex-1 rounded bg-cream-deep" />
            <div className="h-3 w-16 rounded bg-cream-deep" />
          </div>
        ))}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-cream/60 p-6 backdrop-blur-[1px]">
        <div className="max-w-sm rounded-3xl border border-line bg-card p-7 text-center shadow-xl">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-grove text-cream">
            <Lock className="h-5 w-5" />
          </span>
          <h3 className="mt-4 font-display text-xl font-semibold text-ink">
            {tab} is part of the full platform
          </h3>
          <p className="mt-2 text-sm text-ink/65">
            {bullets.join(" · ")} — all wired into the same portal when South
            Lake Fence goes live with the complete build.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink">
            <Lock className="h-4 w-4" /> Unlocks with the full build
          </span>
          <p className="mt-3 text-xs text-ink/45">
            Included in the Sweet Dreams complete-platform package.
          </p>
        </div>
      </div>
    </div>
  );
}

/* keep icons referenced for locked previews */
void MapPin;
void Star;
void ArrowUpRight;
