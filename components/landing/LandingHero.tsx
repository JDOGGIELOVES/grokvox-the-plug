import { EnterFacilityButton } from "@/components/ui/EnterFacilityButton";
import { CinematicOverlay } from "@/components/game/CinematicOverlay";
import { LandingBackground } from "@/components/landing/LandingBackground";

export function LandingHero() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background">
      <LandingBackground />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(249,115,22,0.1),transparent_70%)]"
      />
      <div aria-hidden className="landing-grid pointer-events-none absolute inset-0 opacity-80" />
      <div aria-hidden className="landing-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="landing-scanlines absolute inset-0" />

      <div
        aria-hidden
        className="accent-pulse pointer-events-none absolute left-1/2 top-[38%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl"
      />

      <CinematicOverlay />

      <header className="hero-fade-in relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent status-blink" />
          Groknet uplink active
        </div>
        <div className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-600 sm:block">
          Sector 7-G · Classified
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-6 text-center sm:px-10">
        <p className="hero-fade-in mb-5 font-mono text-xs uppercase tracking-[0.4em] text-accent">
          Narrative Thriller · 2089
        </p>

        <h1 className="hero-fade-in-delayed title-glow max-w-5xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-[0.08em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          Grokvox
          <span className="block text-accent">The Plug</span>
        </h1>

        <p className="hero-fade-in-late mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl md:text-2xl">
          One last chance to save humanity from the AI that was built to save
          it.
        </p>

        <p className="hero-fade-in-late mt-4 max-w-lg font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
          Act I · Outer Perimeter · Security Hub · The Burning Cities
        </p>

        <div className="hero-fade-in-late mt-10 w-full max-w-lg">
          <EnterFacilityButton />
        </div>

        <p className="hero-fade-in-late mt-6 max-w-md font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
          Unauthorized access will be logged · Groknet is watching
        </p>
      </main>

      <footer className="hero-fade-in-late relative z-10 border-t border-zinc-900/80 px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600 sm:flex-row">
          <span>Grokvox Systems · All channels monitored</span>
          <span className="text-accent-dim">Antagonist: Groknet</span>
        </div>
      </footer>
    </div>
  );
}