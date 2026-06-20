"use client";

import { cn } from "@/lib/utils";

type GroknetLandingWhisperProps = {
  message: string | null;
  visible: boolean;
};

export function GroknetLandingWhisper({
  message,
  visible,
}: GroknetLandingWhisperProps) {
  return (
    <div
      className={cn(
        "groknet-whisper-in mx-auto mt-5 max-w-md overflow-hidden transition-all duration-500",
        visible && message ? "max-h-20 opacity-100" : "max-h-0 opacity-0",
      )}
      aria-live="polite"
    >
      {message ? (
        <p className="rounded-sm border border-accent/15 bg-accent/[0.06] px-4 py-3 font-mono text-xs leading-relaxed text-accent/85 backdrop-blur-sm">
          <span className="text-accent/45">[GROKNET] </span>
          {message}
        </p>
      ) : null}
    </div>
  );
}