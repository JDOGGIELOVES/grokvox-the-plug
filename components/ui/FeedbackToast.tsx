import { cn } from "@/lib/utils";

type FeedbackToastProps = {
  message: string | null;
};

export function FeedbackToast({ message }: FeedbackToastProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-24 left-1/2 z-30 -translate-x-1/2 transition-all duration-300",
        message ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
      )}
      aria-live="polite"
    >
      {message ? (
        <p className="feedback-toast-in rounded-sm border border-accent/20 bg-zinc-900/95 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-zinc-200 shadow-lg shadow-black/50">
          {message}
        </p>
      ) : null}
    </div>
  );
}