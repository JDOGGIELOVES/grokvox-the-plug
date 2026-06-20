import { cn } from "@/lib/utils";

type InteractableCardProps = {
  label: string;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
  acquired?: boolean;
  metric?: number;
  className?: string;
};

export function InteractableCard({
  label,
  title,
  description,
  onClick,
  disabled = false,
  acquired = false,
  metric,
  className,
}: InteractableCardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "interactable group relative w-full rounded-sm border px-4 py-4 text-left transition-all duration-300",
        acquired
          ? "cursor-default border-emerald-900/40 bg-emerald-950/20"
          : disabled
            ? "cursor-not-allowed border-zinc-800/50 bg-zinc-950/30 opacity-50"
            : "border-zinc-800/80 bg-zinc-950/50 hover:border-accent/30 hover:bg-zinc-900/70 hover:shadow-[0_0_24px_rgba(249,115,22,0.08)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-sm bg-gradient-to-br from-accent/0 via-accent/0 to-accent/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <p className="relative font-mono text-xs uppercase tracking-widest text-zinc-300">
        {label}
      </p>
      <p className="relative mt-1.5 text-base font-medium text-zinc-50 transition-colors group-hover:text-white">
        {title}
      </p>
      <p className="relative mt-2 text-sm leading-relaxed text-zinc-300">
        {description}
      </p>

      {metric !== undefined ? (
        <div className="relative mt-3 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-dim to-accent transition-all duration-500 group-hover:shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            style={{ width: `${metric}%` }}
          />
        </div>
      ) : null}
    </Component>
  );
}