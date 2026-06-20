"use client";

import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getActThreePresenceLabel } from "@/lib/dialogue/act-three-context";
import {
  getPersonalityVariant,
  getPersonalityVariantWhisper,
} from "@/lib/chapter/act-three-personality-presence";
import { cn } from "@/lib/utils";

type GroknetPresenceBannerProps = {
  context: ActThreeDialogueContext;
  stage?: "deep-core" | "plug-chamber";
  className?: string;
};

export function GroknetPresenceBanner({
  context,
  stage = "deep-core",
  className,
}: GroknetPresenceBannerProps) {
  const variant = getPersonalityVariant(context);
  const variantWhisper = getPersonalityVariantWhisper(context);
  const presenceLabel = getActThreePresenceLabel(context.presenceMode);

  const presenceColor =
    context.presenceMode === "aggressive"
      ? "border-rose-900/40 bg-rose-950/20"
      : context.presenceMode === "vulnerable"
        ? "border-violet-900/40 bg-violet-950/20"
        : "border-emerald-900/40 bg-emerald-950/20";

  const presenceAccent =
    context.presenceMode === "aggressive"
      ? "text-rose-400/85"
      : context.presenceMode === "vulnerable"
        ? "text-violet-400/85"
        : "text-emerald-400/85";

  return (
    <div
      className={cn(
        "groknet-presence-banner w-full rounded-sm border px-4 py-3",
        presenceColor,
        variant?.pulseClass,
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className={cn("font-mono text-[10px] uppercase tracking-[0.32em]", presenceAccent)}>
            Groknet · {presenceLabel}
            {stage === "plug-chamber" ? " · Plug Proximity" : " · Deep Core"}
          </p>
          {variant ? (
            <p
              className={cn(
                "font-display text-sm font-semibold uppercase tracking-[0.08em] sm:text-base",
                variant.accentClass,
              )}
            >
              {variant.label}
            </p>
          ) : (
            <p className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Personality Unsettled
            </p>
          )}
          {variant ? (
            <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
              {variant.subtitle}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "h-2 w-full overflow-hidden rounded-sm bg-zinc-900 sm:mt-2 sm:w-32",
            variant?.glowClass,
          )}
        >
          <div className="personality-voltage-bar h-full w-full" />
        </div>
      </div>
      {variantWhisper ? (
        <p className="mt-3 text-sm italic leading-relaxed text-zinc-300">
          &ldquo;{variantWhisper}&rdquo;
        </p>
      ) : null}
    </div>
  );
}