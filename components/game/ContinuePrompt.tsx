import { Button } from "@/components/ui/Button";
import { playSuccessSound } from "@/lib/sounds";

type ContinuePromptProps = {
  onContinue: () => void;
};

export function ContinuePrompt({ onContinue }: ContinuePromptProps) {
  return (
    <div className="continue-prompt-in w-full rounded-sm border border-accent/30 bg-accent/[0.06] px-5 py-5 text-center shadow-[0_0_32px_rgba(249,115,22,0.1)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
        Act I objectives complete
      </p>
      <p className="mt-2 text-sm text-zinc-400">
        Perimeter breached, uplink closed, corridor crossed. Groknet has been
        taking notes — review your choices before Act II.
      </p>
      <Button
        variant="accent"
        onClick={() => {
          playSuccessSound();
          onContinue();
        }}
        className="mt-5 h-12 min-w-64 px-10 font-mono text-xs uppercase tracking-[0.22em]"
      >
        Complete Chapter
      </Button>
    </div>
  );
}