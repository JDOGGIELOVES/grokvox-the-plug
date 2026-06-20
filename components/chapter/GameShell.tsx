import { CinematicOverlay } from "@/components/game/CinematicOverlay";
import { cn } from "@/lib/utils";

type GameShellProps = {
  children: React.ReactNode;
  className?: string;
  shaking?: boolean;
};

export function GameShell({ children, className, shaking = false }: GameShellProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col bg-background text-foreground",
        shaking && "screen-shake-detection",
        className,
      )}
    >
      <CinematicOverlay />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.06),_transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 landing-vignette opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(1,1,2,0.82)_100%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-8 sm:py-10">
        {children}
      </div>

      <footer className="relative z-10 border-t border-zinc-800/50 py-4 sm:py-5">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-600">
          Groknet is watching · Sector 07
        </p>
      </footer>
    </div>
  );
}