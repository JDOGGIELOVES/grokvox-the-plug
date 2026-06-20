"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  getActTwoPersonalizedHook,
  getActTwoTeaser,
} from "@/lib/chapter-ending";
import { playInteractSound } from "@/lib/sounds";
import type { ChapterOneSummary } from "@/types/run";
import { cn } from "@/lib/utils";

type ActTwoTeaserPanelProps = {
  summary: ChapterOneSummary;
  onClose: () => void;
};

export function ActTwoTeaserPanel({ summary, onClose }: ActTwoTeaserPanelProps) {
  const router = useRouter();
  const teaser = getActTwoTeaser();
  const hook = getActTwoPersonalizedHook(summary);

  return (
    <div className="act-two-teaser-in fixed inset-0 z-[60] flex items-end justify-center bg-background/90 p-4 backdrop-blur-md sm:items-center">
      <div className="my-auto w-full max-w-lg rounded-sm border border-violet-900/30 bg-zinc-950/95 p-6 shadow-2xl shadow-black/80 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-violet-400/80">
          {teaser.subtitle}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.1em] text-zinc-50 sm:text-2xl">
          {teaser.title}
        </h3>

        <div className="mt-5 space-y-4">
          <p className="text-sm leading-relaxed text-zinc-400">{teaser.body}</p>

          <div className="rounded-sm border border-violet-900/25 bg-violet-950/20 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-violet-400/70">
              Groknet · Preview
            </p>
            <p className="mt-2 text-sm italic leading-relaxed text-zinc-300">
              &ldquo;{hook}&rdquo;
            </p>
          </div>

          <ul className="space-y-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {teaser.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="text-violet-400/70">·</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={cn(
            "mt-5 rounded-sm border px-3 py-2 text-center font-mono text-[9px] uppercase tracking-[0.25em]",
            "border-emerald-900/40 bg-emerald-950/25 text-emerald-500/80",
          )}
        >
          {teaser.availability}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="accent"
            onClick={() => {
              playInteractSound();
              router.push("/game/act-2/conversation");
            }}
            className="h-11 flex-1 font-mono text-xs uppercase tracking-[0.18em] shadow-[0_0_24px_rgba(139,92,246,0.2)]"
          >
            Begin The Conversation
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              playInteractSound();
              onClose();
            }}
            className="h-11 flex-1 font-mono text-xs uppercase tracking-[0.18em]"
          >
            Return to Debrief
          </Button>
        </div>
      </div>
    </div>
  );
}