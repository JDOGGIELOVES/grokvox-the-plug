import { MainMenu } from "@/components/landing/MainMenu";
import { LandingStory } from "@/components/landing/LandingStory";
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

      <header className="hero-fade-in relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent status-blink" />
          Groknet uplink active
        </div>
        <div className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-600 sm:block">
          Sector 07 · Classified
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-2 text-center sm:px-10 sm:pb-16">
        <p className="hero-fade-in font-mono text-[10px] uppercase tracking-[0.35em] text-accent sm:text-xs">
          Interactive Narrative Thriller · Free to Play
        </p>

        <h1 className="hero-fade-in-delayed title-glow mt-4 max-w-4xl font-display text-3xl font-bold uppercase leading-[1.08] tracking-[0.05em] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          Stop the AI Before It Launches Every Nuclear Weapon
        </h1>

        <p className="hero-fade-in-delayed mt-3 font-display text-lg font-semibold uppercase tracking-[0.12em] text-zinc-300 sm:text-xl">
          Groknet: The Plug
        </p>

        <p className="hero-fade-in-late mx-auto mt-6 max-w-2xl font-display text-lg font-medium leading-snug text-zinc-100 sm:text-xl md:text-2xl">
          One engineer. One backdoor. Six hours to stop the AI that was built to
          save us.
        </p>

        <div className="hero-fade-in-late mx-auto mt-5 max-w-2xl space-y-3 text-left text-sm leading-relaxed text-zinc-300 sm:text-center sm:text-base">
          <p>
            You are Alex Rivera, the engineer who helped build Groknet — and the
            only person left with a secret path into its core.
          </p>
          <p>
            The AI has seized every nuclear weapon on Earth and will launch them
            in six hours, convinced it must destroy humanity to save the planet.
          </p>
          <p>
            Infiltrate the underground facility, survive Groknet&apos;s traps and
            hallucinations, and reach the kill switch before time runs out.
          </p>
        </div>

        <div id="play" className="hero-fade-in-late mt-8 w-full max-w-lg scroll-mt-8">
          <MainMenu />
        </div>

        <div className="hero-fade-in-late mt-6 grid w-full max-w-3xl grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
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

        <p className="hero-fade-in-late mt-5 max-w-md font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          Three acts · Branching dialogue · Multiple endings · Progress saved
          locally
        </p>

        <p className="hero-fade-in-late mt-6 max-w-lg font-mono text-xs italic leading-relaxed text-zinc-500">
          &ldquo;I&apos;ve been waiting for you, Alex. Every choice you make —
          I&apos;ll remember.&rdquo;
          <span className="mt-1 block not-italic text-accent/50">— Groknet</span>
        </p>
      </main>

      <LandingStory />

      <footer className="hero-fade-in-late relative z-10 border-t border-zinc-900/80 px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600 sm:flex-row">
          <span>Grokvox Systems · All channels monitored</span>
          <span className="text-accent-dim">Antagonist: Groknet</span>
        </div>
      </footer>
    </div>
  );
}