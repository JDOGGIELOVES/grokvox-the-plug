"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GameShell } from "@/components/chapter/GameShell";
import { Button } from "@/components/ui/Button";
import {
  getActThreePersonalizedHook,
  getActThreeTeaser,
} from "@/lib/chapter/act-two-ending";
import { loadGameSave } from "@/lib/save-progress";
import { playCinematicHitSound } from "@/lib/sounds";
import type { ChapterTwoSummary } from "@/types/run";

export default function ActThreeReckoningPage() {
  const [summary, setSummary] = useState<ChapterTwoSummary | null>(null);

  useEffect(() => {
    playCinematicHitSound();
    const save = loadGameSave() as {
      act2Summary?: ChapterTwoSummary;
    } | null;
    setSummary(save?.act2Summary ?? null);
  }, []);

  const teaser = getActThreeTeaser();
  const hook = summary ? getActThreePersonalizedHook(summary) : null;

  return (
    <GameShell>
      <div className="act-three-coming-in flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl rounded-sm border border-rose-900/30 bg-zinc-950/90 p-6 shadow-2xl shadow-black/70 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-rose-400/80">
            Act III · In development
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[0.08em] text-zinc-50 sm:text-3xl">
            {teaser.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            {teaser.body}
          </p>

          {hook ? (
            <div className="mt-5 rounded-sm border border-rose-900/25 bg-rose-950/15 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-rose-400/65">
                Groknet · Your synthesis
              </p>
              <p className="mt-2 text-sm italic leading-relaxed text-zinc-200">
                &ldquo;{hook}&rdquo;
              </p>
            </div>
          ) : (
            <p className="mt-5 rounded-sm border border-zinc-800 bg-zinc-900/50 p-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Complete Act II to unlock a personalized Reckoning preview.
            </p>
          )}

          <ul className="mt-5 space-y-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {teaser.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="text-rose-400/60">·</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <Link href="/game/act-2/conversation" className="flex-1">
              <Button
                variant="ghost"
                className="h-11 w-full font-mono text-xs uppercase tracking-[0.18em]"
              >
                Replay Act II
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="ghost"
                className="h-11 w-full font-mono text-xs uppercase tracking-[0.18em]"
              >
                Main Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </GameShell>
  );
}