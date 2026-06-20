import { CinematicOverlay } from "@/components/game/CinematicOverlay";
import { cn } from "@/lib/utils";

export type GameShellVariant = "act-1" | "act-2" | "act-3";

type GameShellProps = {
  children: React.ReactNode;
  className?: string;
  shaking?: boolean;
  variant?: GameShellVariant;
};

export function GameShell({
  children,
  className,
  shaking = false,
  variant = "act-1",
}: GameShellProps) {
  return (
    <div
      className={cn(
        "game-shell relative flex min-h-screen flex-col bg-background text-foreground",
        `game-shell-${variant}`,
        shaking && "screen-shake-detection",
        className,
      )}
    >
      <CinematicOverlay />

      <div className="game-shell-glow pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-0 landing-vignette opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(1,1,2,0.65)_100%)]" />

      <div className="game-readable relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-8 sm:py-10">
        {children}
      </div>

      <footer className="relative z-10 border-t border-zinc-800/50 py-4 sm:py-5">
        <p className="text-center font-mono text-xs uppercase tracking-[0.35em] text-zinc-400">
          Groknet is watching · Sector 07
        </p>
      </footer>
    </div>
  );
}