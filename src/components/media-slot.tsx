import { Film, ImageIcon } from "lucide-react";
import { clsx } from "clsx";

/**
 * A placeholder for real brand media the business will supply — used instead
 * of any AI-generated photo of people. Reads as an intentional "drop your
 * footage here" slot, on-brand rather than broken.
 */
export function MediaSlot({
  kind = "video",
  label,
  note,
  className,
}: {
  kind?: "video" | "photo";
  label: string;
  note?: string;
  className?: string;
}) {
  const Icon = kind === "video" ? Film : ImageIcon;
  return (
    <div
      className={clsx(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-grove/25 bg-cream-deep/50 p-8 text-center",
        className,
      )}
    >
      {/* subtle post-and-rail texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--grove) 0 2px, transparent 2px 26px)",
        }}
      />
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-grove/10 text-grove">
        <Icon className="h-7 w-7" />
      </span>
      <p className="mt-4 font-display text-xl font-semibold text-grove">
        {label}
      </p>
      {note && <p className="mt-1.5 max-w-xs text-sm text-ink/55">{note}</p>}
      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-grove/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-grove/70">
        {kind === "video" ? "Video" : "Photo"} placeholder
      </span>
    </div>
  );
}
