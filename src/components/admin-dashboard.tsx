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
  X,
  User,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { business, materials } from "@/lib/site";
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
  const [estimateFor, setEstimateFor] = useState<Lead | null>(null);
  const isLocked = lockedTabs.some((t) => t.key === tab);

  function createEstimate(lead: Lead) {
    setEstimateFor(lead);
    setTab("Estimates");
  }

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

        {tab === "Inquiries" && <InquiriesTab onCreateEstimate={createEstimate} />}
        {tab === "Estimates" && (
          <EstimatesTab
            preset={estimateFor}
            onConsumePreset={() => setEstimateFor(null)}
          />
        )}
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
    <div className="rounded-2xl border border-line">
      {/* Wide screens: a real table */}
      <table className="hidden w-full text-left text-sm lg:table">
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

      {/* Phones: each row becomes a stacked card — no sideways scroll */}
      <ul className="divide-y divide-line lg:hidden">
        {rows.map((r, i) => (
          <li key={i} className="grid gap-1.5 p-4">
            {r.map((c, j) =>
              head[j] ? (
                <div
                  key={j}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-ink/40">
                    {head[j]}
                  </span>
                  <span className="min-w-0 break-words text-right text-ink/80">
                    {c}
                  </span>
                </div>
              ) : null,
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Shared lead model ---------- */
type Lead = {
  id: string;
  name: string;
  town?: string;
  phone?: string;
  email?: string;
  wants: string;
  material: string;
  height?: string;
  gate?: string;
  length?: string;
  addons: string[];
  via: string;
  status: string;
  received: string;
  live?: boolean;
};

const seedLeads: Lead[] = [
  { id: "L-DANA", name: "Dana R.", town: "Winter Garden", phone: "(407) 555-0148", email: "dana.r@email.com", wants: "Aluminum pool fence", material: "Aluminum Ornamental", height: "5 ft", gate: "Self-closing pool gate", length: "~120 ft", addons: ["Self-closing / self-latching hardware"], via: "Styles film → Quote this style", status: "New", received: "2h ago" },
  { id: "L-MCAR", name: "Mike & Carol T.", town: "Groveland", phone: "(352) 555-0173", email: "mct@email.com", wants: "Storm repair — 40 ft down", material: "Wood Privacy", height: "6 ft", gate: "Single walk gate", length: "~40 ft", addons: ["Stain & seal package"], via: "Design-Your-Fence builder", status: "Called back", received: "Yesterday" },
  { id: "L-OAKG", name: "Oak Grove HOA", town: "Minneola", phone: "(407) 555-0199", email: "board@oakgrovehoa.org", wants: "Community perimeter walk-through", material: "Aluminum Ornamental", height: "6 ft", gate: "Keyed lockable gate", length: "~1,400 ft", addons: [], via: "Commercial page — site brief", status: "Visit booked", received: "Yesterday" },
  { id: "L-PRIY", name: "Priya S.", town: "Montverde", phone: "(407) 555-0121", email: "priya.s@email.com", wants: "Wood privacy + pool-code check", material: "Wood Privacy", height: "6 ft", gate: "Double drive gate", length: "~160 ft", addons: ["Stain & seal package"], via: "Pool self-inspection → fix it", status: "Visit booked", received: "2 days ago" },
  { id: "L-JBAR", name: "J. Barnett", town: "Groveland", phone: "(352) 555-0110", email: "jbarnett@email.com", wants: "Wrought iron entrance", material: "Wrought Iron", height: "6 ft", gate: "Automated drive gate", length: "~90 ft", addons: ["Gate automation"], via: "Phone call", status: "Called back", received: "3 days ago" },
];

function liveToLead(q: Inquiry): Lead {
  return {
    id: q.id,
    name: q.name,
    phone: q.phone,
    email: q.email,
    wants: `${q.material} quote`,
    material: q.material,
    height: q.height,
    gate: q.gate,
    length: q.length,
    addons: q.addons,
    via: q.via,
    status: "New",
    received: timeAgo(q.createdAt),
    live: true,
  };
}

function useLeads(): Lead[] {
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
  return [...live.map(liveToLead), ...seedLeads];
}

function priceFor(materialName: string): number {
  return materials.find((m) => m.name === materialName)?.priceFrom ?? 30;
}
function lengthNum(s?: string): number {
  const m = (s ?? "").match(/(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 150;
}
function suggestedAmount(lead: Lead): number {
  const raw = priceFor(lead.material) * lengthNum(lead.length) * 1.15;
  return Math.round(raw / 10) * 10;
}
const money = (n: number) => `$${n.toLocaleString()}`;

/* ---------- LIVE: Inquiries in ---------- */
function InquiriesTab({
  onCreateEstimate,
}: {
  onCreateEstimate: (lead: Lead) => void;
}) {
  const leads = useLeads();
  const liveCount = leads.filter((l) => l.live).length;
  const [open, setOpen] = useState<Lead | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi
          label="New this week"
          value={String(11 + liveCount)}
          delta={liveCount ? `+${liveCount} just now` : "+4 vs last week"}
          icon={Inbox}
        />
        <Kpi label="Awaiting callback" value={String(3 + liveCount)} icon={Phone} />
        <Kpi label="Visits booked" value="5" delta="from inquiries" icon={CheckCircle2} />
      </div>

      {liveCount > 0 && (
        <div className="flex items-start gap-2 rounded-2xl border border-clay/30 bg-clay/5 px-4 py-3 text-sm text-clay">
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">
              {liveCount} quote{liveCount > 1 ? "s" : ""} just came in from the
              site
            </span>{" "}
            — a real build emails the customer their confirmation and pings the
            team. (Emails are disabled in this demo.)
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-line">
        {/* Wide screens: a real table */}
        <table className="hidden w-full text-left text-sm lg:table">
          <thead className="bg-cream/50 text-xs uppercase tracking-wide text-ink/50">
            <tr>
              {["From", "Wants", "Came in via", "Received", "Status", ""].map(
                (h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((l) => (
              <tr
                key={l.id}
                onClick={() => setOpen(l)}
                className="cursor-pointer transition-colors hover:bg-cream/40"
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    {l.live && (
                      <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-clay" />
                    )}
                    <span className="font-semibold text-ink">{l.name}</span>
                  </span>
                  {l.town && (
                    <span className="mt-0.5 block text-xs text-ink/50">
                      {l.town}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink/80">{l.wants}</td>
                <td className="px-4 py-3 text-ink/70">{l.via}</td>
                <td className="px-4 py-3 text-ink/70">{l.received}</td>
                <td className="px-4 py-3">
                  <StatusPill s={l.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight className="ml-auto h-4 w-4 text-ink/35" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Phones: each inquiry is a tappable card — no sideways scroll */}
        <ul className="divide-y divide-line lg:hidden">
          {leads.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setOpen(l)}
                className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-cream/40 active:bg-cream/60"
              >
                <div className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    {l.live && (
                      <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-clay" />
                    )}
                    <span className="truncate font-semibold text-ink">
                      {l.name}
                    </span>
                  </span>
                  {l.town && (
                    <span className="mt-0.5 block text-xs text-ink/50">
                      {l.town}
                    </span>
                  )}
                  <span className="mt-1.5 block text-sm text-ink/80">
                    {l.wants}
                  </span>
                  <span className="mt-1 block text-xs text-ink/50">
                    {l.via} · {l.received}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <StatusPill s={l.status} />
                  <ChevronRight className="h-4 w-4 text-ink/35" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="flex items-center gap-2 rounded-2xl bg-grove/5 px-4 py-3 text-sm text-grove">
        <Phone className="h-4 w-4 shrink-0" />
        Tap any inquiry to see the full request and send an estimate.
      </p>

      {open && (
        <InquiryModal
          lead={open}
          onClose={() => setOpen(null)}
          onCreateEstimate={(l) => {
            setOpen(null);
            onCreateEstimate(l);
          }}
        />
      )}
    </div>
  );
}

function DetailRow({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-ink/45">
        {k}
      </dt>
      <dd className="text-right text-sm font-medium text-ink">{v}</dd>
    </div>
  );
}

function InquiryModal({
  lead,
  onClose,
  onCreateEstimate,
}: {
  lead: Lead;
  onClose: () => void;
  onCreateEstimate: (lead: Lead) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-grove-deep/50 p-0 backdrop-blur-[1px] sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-label={`Inquiry from ${lead.name}`}
        className="relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-card shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              {lead.live && (
                <span className="inline-flex h-2 w-2 rounded-full bg-clay" />
              )}
              <h3 className="font-display text-xl font-semibold text-ink">
                {lead.name}
              </h3>
              <StatusPill s={lead.status} />
            </div>
            <p className="mt-1 text-sm text-ink/55">
              {lead.town ? `${lead.town} · ` : ""}
              {lead.received}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink/60 hover:bg-cream-deep"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={lead.phone ? `tel:${lead.phone.replace(/[^\d+]/g, "")}` : undefined}
              className={clsx(
                "flex items-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm",
                lead.phone ? "text-grove hover:bg-cream-deep" : "text-ink/40",
              )}
            >
              <Phone className="h-4 w-4 shrink-0" />
              {lead.phone ?? "No phone given"}
            </a>
            <a
              href={lead.email ? `mailto:${lead.email}` : undefined}
              className={clsx(
                "flex items-center gap-2 truncate rounded-2xl border border-line px-4 py-3 text-sm",
                lead.email ? "text-grove hover:bg-cream-deep" : "text-ink/40",
              )}
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{lead.email ?? "No email given"}</span>
            </a>
          </div>

          <dl className="mt-2 divide-y divide-line">
            <DetailRow k="Wants" v={lead.wants} />
            <DetailRow k="Material" v={lead.material} />
            {lead.height && <DetailRow k="Height" v={lead.height} />}
            {lead.gate && <DetailRow k="Gate" v={lead.gate} />}
            {lead.length && <DetailRow k="Length" v={lead.length} />}
            <DetailRow
              k="Add-ons"
              v={lead.addons.length ? lead.addons.join(", ") : "—"}
            />
            <DetailRow k="Came in via" v={lead.via} />
          </dl>
        </div>

        <div className="flex flex-col gap-2 border-t border-line px-6 py-4 sm:flex-row">
          <button
            type="button"
            onClick={() => onCreateEstimate(lead)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-clay px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay-dark"
          >
            <FileText className="h-4 w-4" /> Create estimate
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink/70 hover:bg-cream-deep"
          >
            Log a callback
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- LIVE: Estimates out via email ---------- */
type SentEstimate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  amount: number;
};

function EstimatesTab({
  preset,
  onConsumePreset,
}: {
  preset: Lead | null;
  onConsumePreset: () => void;
}) {
  const leads = useLeads();

  const [customerId, setCustomerId] = useState("__new__");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState<SentEstimate[]>([]);
  const [justSent, setJustSent] = useState<SentEstimate | null>(null);

  // Prefill when arriving from an inquiry's "Create estimate"
  useEffect(() => {
    if (!preset) return;
    setCustomerId(preset.id);
    setName(preset.name);
    setEmail(preset.email ?? "");
    setPhone(preset.phone ?? "");
    setProject(
      `${preset.material}${preset.length ? `, ${preset.length}` : ""}${
        preset.gate ? ` · ${preset.gate}` : ""
      }`,
    );
    setAmount(String(suggestedAmount(preset)));
    setJustSent(null);
    setTried(false);
    onConsumePreset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  function selectCustomer(id: string) {
    setCustomerId(id);
    if (id === "__new__") {
      setName("");
      setEmail("");
      setPhone("");
      setProject("");
      setAmount("");
      return;
    }
    const l = leads.find((x) => x.id === id);
    if (l) {
      setName(l.name);
      setEmail(l.email ?? "");
      setPhone(l.phone ?? "");
      setProject(`${l.material}${l.length ? `, ${l.length}` : ""}`);
      setAmount(String(suggestedAmount(l)));
    }
  }

  const canSend =
    name.trim().length > 1 &&
    (email.trim().length > 3 || phone.trim().length >= 7) &&
    project.trim().length > 1 &&
    Number(String(amount).replace(/[^\d]/g, "")) > 0;

  function send(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!canSend) return;
    const est: SentEstimate = {
      id: `EST-${2045 + sent.length}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      project: project.trim(),
      amount: Number(String(amount).replace(/[^\d]/g, "")) || 0,
    };
    setSent((s) => [est, ...s]);
    setJustSent(est);
    setCustomerId("__new__");
    setName("");
    setEmail("");
    setPhone("");
    setProject("");
    setAmount("");
    setTried(false);
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-cream/40 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-clay";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Sent this month" value={String(23 + sent.length)} delta="61% accepted" icon={Send} />
        <Kpi label="Opened, not signed" value="4" icon={MailOpen} />
        <Kpi label="Drafts ready" value="2" icon={FileText} />
      </div>

      {/* Just-sent email preview */}
      {justSent && (
        <div className="overflow-hidden rounded-2xl border-2 border-grove/30">
          <div className="flex items-center justify-between gap-2 border-b border-line bg-grove/8 px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-grove">
              <MailCheck className="h-4 w-4" /> Estimate sent · {justSent.id}
            </span>
            <StatusPill s="Emailed" />
          </div>
          <div className="space-y-2 px-4 py-4 text-sm">
            <p>
              <span className="mr-2 text-ink/45">To:</span>
              <span className="font-medium text-ink">
                {justSent.email || justSent.phone || "the customer"}
              </span>
            </p>
            <p>
              <span className="mr-2 text-ink/45">Subject:</span>
              <span className="font-medium text-ink">
                Your South Lake Fence estimate — {justSent.project}
              </span>
            </p>
            <p className="text-ink/70">
              Hi {justSent.name.split(" ")[0]} — here&apos;s your itemized
              estimate at <span className="font-semibold text-grove">{money(justSent.amount)}</span>,
              good for 30 days. Questions? Call {business.phone} and ask for
              Ray.
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-cream/60 px-3 py-1.5 text-xs font-medium text-ink/70">
              <Paperclip className="h-3.5 w-3.5" />{" "}
              {justSent.id}-{justSent.name.split(" ")[0].toLowerCase()}.pdf
            </span>
            <p className="pt-1 text-xs text-ink/45">
              Demo: no real email is sent. A live build renders the PDF and
              emails it from the owner&apos;s address.
            </p>
          </div>
        </div>
      )}

      {/* New estimate form */}
      <form onSubmit={send} className="rounded-2xl border border-line p-5 sm:p-6" noValidate>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-clay" />
          <h3 className="font-display text-lg font-semibold text-ink">
            New estimate
          </h3>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
              Customer
            </span>
            <div className="relative">
              <select
                value={customerId}
                onChange={(e) => selectCustomer(e.target.value)}
                className={clsx(inputCls, "appearance-none pr-9")}
              >
                <option value="__new__">＋ New customer…</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                    {l.town ? ` — ${l.town}` : ""}
                    {l.live ? " (new lead)" : ""}
                  </option>
                ))}
              </select>
              {customerId === "__new__" ? (
                <UserPlus className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              ) : (
                <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              )}
            </div>
          </label>

          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
              autoComplete="name"
              className={clsx(inputCls, tried && name.trim().length <= 1 && "border-clay")}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              className={inputCls}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              type="tel"
              autoComplete="tel"
              className={inputCls}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="Project (e.g. Aluminum Ornamental, ~120 ft)"
              className={clsx(inputCls, tried && project.trim().length <= 1 && "border-clay")}
            />
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink/50">
                $
              </span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                inputMode="numeric"
                className={clsx(inputCls, "pl-7 sm:w-36", tried && Number(String(amount).replace(/[^\d]/g, "")) <= 0 && "border-clay")}
              />
            </div>
          </div>

          {tried && !canSend && (
            <p className="text-xs font-medium text-clay">
              Add a customer name, a phone or email, the project, and an amount.
            </p>
          )}

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink/50">
              Amount auto-suggests from material × length — edit it to your real
              number.
            </p>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-clay-dark sm:w-auto"
            >
              <Send className="h-4 w-4" /> Send estimate (demo)
            </button>
          </div>
        </div>
      </form>

      <Table
        head={["Estimate", "Customer", "Project", "Emailed to", "Sent", "Status"]}
        rows={[
          ...sent.map((e) => [
            e.id,
            e.name,
            `${e.project} · ${money(e.amount)}`,
            e.email || e.phone || "—",
            "just now",
            <StatusPill key="s" s="Emailed" />,
          ]),
          ["EST-2044", "Dana R.", "Aluminum pool fence", "dana.r@email.com", "—", <StatusPill key="s" s="Drafting" />],
          ["EST-2041", "Alvarez family", "Vinyl privacy, 210 ft", "alvarez.fam@email.com", "Tue", <StatusPill key="s" s="Opened" />],
          ["EST-2040", "Oak Grove HOA", "Community perimeter", "board@oakgrovehoa.org", "Mon", <StatusPill key="s" s="Emailed" />],
          ["EST-2039", "Mike & Carol T.", "Storm repair, 40 ft", "mct@email.com", "Mon", <StatusPill key="s" s="Accepted" />],
          ["EST-2036", "J. Barnett", "Wrought iron entrance", "jbarnett@email.com", "Last wk", <StatusPill key="s" s="Accepted" />],
        ]}
      />

      <p className="flex items-center gap-2 rounded-2xl bg-grove/5 px-4 py-3 text-sm text-grove">
        <MailCheck className="h-4 w-4 shrink-0" />
        Estimates go out as clean, itemized PDFs from your own email — opens and
        acceptances tracked right here.
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
