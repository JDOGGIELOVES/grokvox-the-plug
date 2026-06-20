import { getGameResumeTarget } from "@/lib/game-resume";
import {
  hasAnyGameProgress,
  hasResumableCheckpoint,
  loadGameSave,
} from "@/lib/save-progress";

export type ActMenuEntry = {
  id: "act-1" | "act-2" | "act-3";
  label: string;
  subtitle: string;
  route: string;
  unlocked: boolean;
  completed: boolean;
};

export type GameMenuState = {
  canContinue: boolean;
  hasProgress: boolean;
  continueRoute: string;
  continueLabel: string;
  continueDetail: string;
  progressLine: string;
  acts: ActMenuEntry[];
};

const ACT_ENTRIES: Omit<ActMenuEntry, "unlocked" | "completed">[] = [
  {
    id: "act-1",
    label: "Act I",
    subtitle: "The Infiltration",
    route: "/game/act-1/infiltration",
  },
  {
    id: "act-2",
    label: "Act II",
    subtitle: "The Conversation",
    route: "/game/act-2/conversation",
  },
  {
    id: "act-3",
    label: "Act III",
    subtitle: "The Reckoning",
    route: "/game/act-3/reckoning",
  },
];

export function getGameMenuState(): GameMenuState {
  const save = loadGameSave();
  const resume = getGameResumeTarget();

  const acts: ActMenuEntry[] = ACT_ENTRIES.map((act) => ({
    ...act,
    unlocked:
      act.id === "act-1"
        ? true
        : act.id === "act-2"
          ? !!save?.summary
          : !!save?.act2Summary,
    completed:
      act.id === "act-1"
        ? !!save?.act1Complete
        : act.id === "act-2"
          ? !!save?.act2Complete
          : !!save?.act3Complete,
  }));

  const hasProgress = hasAnyGameProgress();
  const canContinue =
    hasResumableCheckpoint() ||
    resume.detail !== "Begin Infiltration";

  let progressLine = "Sector 07 awaits your first breach.";
  if (save?.act3Complete) {
    progressLine = "All three acts complete — four endings unlocked.";
  } else if (save?.act2Summary) {
    progressLine = save.act2Complete
      ? "Act II sealed. The Reckoning calls from the Deep Core."
      : "Act II in progress — Groknet remembers every word.";
  } else if (save?.summary) {
    progressLine = save.act1Complete
      ? "Act I complete. The Residential Sector lies ahead."
      : "Act I in progress — the clock is still running.";
  } else if (hasResumableCheckpoint()) {
    progressLine = "Checkpoint detected — pick up where you left off.";
  }

  return {
    canContinue,
    hasProgress,
    continueRoute: resume.route,
    continueLabel: resume.actLabel,
    continueDetail: resume.detail,
    progressLine,
    acts,
  };
}