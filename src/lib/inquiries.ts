// Demo-only inquiry store. Real build would POST to an API that saves the
// lead and fires the two email notifications (customer + admin). Here we
// persist to localStorage so a submitted quote shows up in /admin → Inquiries.
export type Inquiry = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  propertyType: string;
  material: string;
  height: string;
  gate: string;
  length: string;
  addons: string[];
  via: string;
  createdAt: number;
};

const KEY = "slf:inquiries";

export function addInquiry(
  data: Omit<Inquiry, "id" | "createdAt">,
): Inquiry {
  const entry: Inquiry = {
    ...data,
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    createdAt: Date.now(),
  };
  try {
    const list = getInquiries();
    localStorage.setItem(KEY, JSON.stringify([entry, ...list].slice(0, 12)));
    // A real backend fires the customer + admin emails here. Demo: no send.
    window.dispatchEvent(new CustomEvent("slf:inquiry-added", { detail: entry }));
  } catch {
    /* storage unavailable — non-fatal for the demo */
  }
  return entry;
}

export function getInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Inquiry[]) : [];
  } catch {
    return [];
  }
}

export function timeAgo(ts: number): string {
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
