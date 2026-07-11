/** Small post-and-rail divider motif echoing the logo mark. */
export function PostRail({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center gap-0 ${className}`}
    >
      <span className="h-px w-10 bg-current opacity-40 sm:w-16" />
      <span className="mx-1.5 h-4 w-1 rounded-sm bg-current opacity-70" />
      <span className="h-px w-6 bg-current opacity-40 sm:w-10" />
      <span className="mx-1.5 h-5 w-1 rounded-sm bg-current" />
      <span className="h-px w-6 bg-current opacity-40 sm:w-10" />
      <span className="mx-1.5 h-4 w-1 rounded-sm bg-current opacity-70" />
      <span className="h-px w-10 bg-current opacity-40 sm:w-16" />
    </div>
  );
}
