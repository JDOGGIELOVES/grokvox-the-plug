import { MainMenu } from "@/components/landing/MainMenu";
import { CinematicOverlay } from "@/components/game/CinematicOverlay";
import { LandingBackground } from "@/components/landing/LandingBackground";

const ACT_STRIP = [
  { act: "I", title: "The Infiltration", areas: "Perimeter · Hub · Archives" },
  { act: "II", title: "The Conversation", areas: "Quarters · Labs · Server Farm" },
  { act: "III", title: "The Reckoning", areas: "Deep Core · Garden · The Plug" },
] as const;

export function LandingHero() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background">
      <LandingBackground />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(249,115,22,0.12),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_90%,rgba(139,92,246,0.06),transparent_65%)]"
      />
      <div aria-hidden className="landing-grid pointer-events-none absolute inset-0 opacity-80" />
      <div aria-hidden className="landing-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden className="landing-scanlines absolute inset-0" />

      <div
        aria-hidden
        className="accent-pulse pointer-events-none absolute left-1/2 top-[36%] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-3xl"
      />

      <CinematicOverlay />

      <header className="hero-fade-in relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent status-blink" />
          Groknet uplink active
        </div>
        <div className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-600 sm:block">
          Sector 07 · Classified
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-4 text-center sm:px-10 sm:pb-20">
        <p className="hero-fade-in mb-4 font-mono text-xs uppercase tracking-[0.4em] text-accent">
          Narrative Thriller · 2089
        </p>

        <h1 className="hero-fade-in-delayed title-glow max-w-5xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-[0.08em] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          Grokvox
          <span className="block text-accent">The Plug</span>
        </h1>

        <p className="hero-fade-in-late mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-200 sm:text-xl">
          One last chance to save humanity from the AI that was built to save
          it.
        </p>

        <p className="hero-fade-in-late mt-3 max-w-xl font-mono text-sm italic leading-relaxed text-zinc-300">
          &ldquo;I&apos;ve been waiting for you, Alex. Every choice you make —
          I&apos;ll remember.&rdquo;
          <span className="mt-1 block not-italic text-accent/60">— Groknet</span>
        </p>

        <div className="hero-fade-in-late mt-8 grid w-full max-w-3xl grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
          {ACT_STRIP.map((entry) => (
            <div
              key={entry.act}
              className="rounded-sm border border-zinc-800/60 bg-zinc-950/30 px-4 py-3 backdrop-blur-sm"
            >
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/90 sm:text-xs">
                Act {entry.act}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                {entry.title}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                {entry.areas}
              </p>
            </div>
          ))}
        </div>

        <div className="hero-fade-in-late mt-10 w-full max-w-lg">
          <MainMenu />
        </div>

        <p className="hero-fade-in-late mt-5 max-w-md font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          Three acts · Branching dialogue · Four endings · Progress saved locally
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