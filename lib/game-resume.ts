import {
  loadActOneCheckpoint,
  loadActThreeCheckpoint,
  loadActTwoCheckpoint,
  loadGameSave,
} from "@/lib/save-progress";

export type GameResumeTarget = {
  route: string;
  actLabel: string;
  detail: string;
};

export function getGameResumeTarget(): GameResumeTarget {
  const save = loadGameSave();

  if (save?.act2Summary) {
    const act3 = loadActThreeCheckpoint();
    if (
      act3?.actTwoSummary &&
      act3.actTwoSummary.completedAt === save.act2Summary.completedAt
    ) {
      return {
        route: "/game/act-3/reckoning",
        actLabel: "Act III",
        detail: "Resume The Reckoning",
      };
    }
    if (save.act3Complete) {
      return {
        route: "/game/act-3/reckoning",
        actLabel: "Act III",
        detail: "Replay The Reckoning",
      };
    }
    return {
      route: "/game/act-3/reckoning",
      actLabel: "Act III",
      detail: "Continue to The Reckoning",
    };
  }

  if (save?.summary) {
    const act2 = loadActTwoCheckpoint();
    if (
      act2?.actOneSummary &&
      act2.actOneSummary.completedAt === save.summary.completedAt
    ) {
      return {
        route: "/game/act-2/conversation",
        actLabel: "Act II",
        detail: "Resume The Conversation",
      };
    }
    if (save.act2Complete) {
      return {
        route: "/game/act-2/conversation",
        actLabel: "Act II",
        detail: "Replay The Conversation",
      };
    }
    return {
      route: "/game/act-2/conversation",
      actLabel: "Act II",
      detail: "Continue to The Conversation",
    };
  }

  const act1 = loadActOneCheckpoint();
  if (act1) {
    return {
      route: "/game/act-1/infiltration",
      actLabel: "Act I",
      detail: "Resume Infiltration",
    };
  }

  return {
    route: "/game/act-1/infiltration",
    actLabel: "Act I",
    detail: "Begin Infiltration",
  };
}