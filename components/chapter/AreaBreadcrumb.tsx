"use client";

import { AREA_LABELS } from "@/lib/chapter/area-transitions";
import type { ChapterStage } from "@/types/chapter";
import { cn } from "@/lib/utils";

const ACT_ONE_AREAS: ChapterStage[] = [
  "outer-perimeter",
  "security-hub",
  "data-archives",
];

type AreaBreadcrumbProps = {
  current: ChapterStage;
  className?: string;
};

export function AreaBreadcrumb({ current, className }: AreaBreadcrumbProps) {
  const currentIndex = ACT_ONE_AREAS.indexOf(current);

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center justify-center gap-2",
        className,
      )}
    >
      {ACT_ONE_AREAS.map((area, index) => {
        const isCurrent = area === current;
        const isPast = index < currentIndex;

        return (
          <div key={area} className="flex items-center gap-2">
            {index > 0 ? (
              <span
                className={cn(
                  "font-mono text-zinc-700 transition-colors duration-500",
                  isPast && "text-accent/40",
                )}
              >
                —
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-500",
                isCurrent
                  ? "area-breadcrumb-active border-accent/40 bg-accent/10 text-accent"
                  : isPast
                    ? "border-zinc-700/80 bg-zinc-900/40 text-zinc-500"
                    : "border-zinc-800 text-zinc-600",
              )}
            >
              {isPast ? "✓ " : ""}
              {AREA_LABELS[area]}
            </span>
          </div>
        );
      })}
    </div>
  );
}