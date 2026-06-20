import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "accent";
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]",
        variant === "primary" &&
          "border border-zinc-600 bg-zinc-100 text-zinc-900 hover:bg-white hover:shadow-md hover:shadow-black/30",
        variant === "ghost" &&
          "border border-zinc-700 bg-transparent text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-50",
        variant === "accent" &&
          "border border-accent/60 bg-accent text-zinc-950 hover:bg-accent-bright hover:shadow-[0_0_28px_rgba(249,115,22,0.35)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}