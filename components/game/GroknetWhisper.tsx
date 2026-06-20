import { cn } from "@/lib/utils";

type GroknetWhisperProps = {
  message: string | null;
};

export function GroknetWhisper({ message }: GroknetWhisperProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border border-accent/10 bg-accent/[0.04] px-4 py-3 transition-all duration-500",
        message ? "max-h-24 opacity-100" : "max-h-0 border-transparent py-0 opacity-0",
      )}
    >
      {message ? (
        <p className="font-mono text-xs leading-relaxed text-accent/80">
          <span className="text-accent/50">[GROKNET] </span>
          {message}
        </p>
      ) : null}
    </div>
  );
}