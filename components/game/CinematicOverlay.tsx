import type { ChapterStage } from "@/types/chapter";
import { cn } from "@/lib/utils";

export type OverlayIntensity = "calm" | "tense" | "hallucination";

type CinematicOverlayProps = {
  intensity?: OverlayIntensity;
  stage?: ChapterStage;
};

export function CinematicOverlay({
  intensity = "calm",
  stage,
}: CinematicOverlayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[5] transition-opacity duration-700",
        intensity === "tense" && "cinematic-overlay-tense",
        intensity === "hallucination" && "cinematic-overlay-hallucination",
        stage === "outer-perimeter" && "cinematic-overlay-perimeter",
        stage === "security-hub" && "cinematic-overlay-hub",
        stage === "data-archives" && "cinematic-overlay-archives",
        stage === "residential-sector" && "cinematic-overlay-residential",
        stage === "research-wing" && "cinematic-overlay-research",
        stage === "central-server-farm" && "cinematic-overlay-server-farm",
        stage === "deep-core-access" && "cinematic-overlay-deep-core",
        stage === "final-approach" && "cinematic-overlay-final-approach",
        stage === "plug-chamber" && "cinematic-overlay-plug-chamber",
      )}
      aria-hidden
    >
      <div className="cinematic-vignette absolute inset-0" />
      <div className="cinematic-scanlines absolute inset-0" />
      <div className="cinematic-grain absolute inset-0" />
    </div>
  );
}