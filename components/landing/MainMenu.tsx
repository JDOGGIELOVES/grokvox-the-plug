"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GroknetLandingWhisper } from "@/components/landing/GroknetLandingWhisper";
import { getGameMenuState, type GameMenuState } from "@/lib/game-menu";
import { playGroknetVoiceLine } from "@/lib/hallucination";
import {
  LANDING_GROKNET_ENTER_VOICE,
  pickLandingHoverLine,
} from "@/lib/landing";
import { clearAllGameData } from "@/lib/save-progress";
import { playDoorSound, playInteractSound } from "@/lib/sounds";
import { cn } from "@/lib/utils";

type MenuAction = "continue" | "new-game" | "enter" | "act" | null;

export function MainMenu() {
  const router = useRouter();
  const [menu, setMenu] = useState<GameMenuState | null>(null);
  const [action, setAction] = useState<MenuAction>(null);
  const [confirmNewGame, setConfirmNewGame] = useState(false);
  const [hoverLine, setHoverLine] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMenu(getGameMenuState());
  }, []);

  const navigate = useCallback(
    (route: string, mode: MenuAction) => {
      if (action) return;
      setAction(mode);
      setIsHovered(true);
      setHoverLine("Uplink routing…");
      playGroknetVoiceLine(LANDING_GROKNET_ENTER_VOICE);
      playDoorSound();
      window.setTimeout(() => router.push(route), 900);
    },
    [action, router],
  );

  const handleContinue = useCallback(() => {
    if (!menu) return;
    navigate(menu.continueRoute, "continue");
  }, [menu, navigate]);

  const handleNewGame = useCallback(() => {
    if (!menu?.hasProgress) {
      navigate("/game/act-1/infiltration", "enter");
      return;
    }
    setConfirmNewGame(true);
    playInteractSound();
  }, [menu, navigate]);

  const confirmNewGameStart = useCallback(() => {
    clearAllGameData();
    setConfirmNewGame(false);
    navigate("/game/act-1/infiltration", "new-game");
  }, [navigate]);

  const showWhisper = useCallback(() => {
    setHoverLine(pickLandingHoverLine());
    setIsHovered(true);
  }, []);

  if (!menu) {
    return (
      <div className="flex min-h-[9rem] items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-zinc-300">
          Groknet scanning local uplink…
        </p>
      </div>
    );
  }

  const entering = action !== null;

  return (
    <div
      className="flex w-full max-w-lg flex-col items-center gap-4"
      onMouseEnter={showWhisper}
      onMouseLeave={() => setIsHovered(false)}
    >
      {menu.canContinue ? (
        <button
          type="button"
          onClick={handleContinue}
          disabled={entering}
          className={cn(
            "enter-facility-btn group relative w-full min-h-14 rounded-sm px-8 py-5",
            "font-display text-sm font-bold uppercase tracking-[0.2em] text-zinc-950 sm:text-base",
            "bg-accent shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-500",
            "hover:bg-accent-bright hover:scale-[1.02] active:scale-[0.98]",
            entering && action === "continue" && "enter-facility-btn-active",
          )}
        >
          <span className="enter-facility-btn-border pointer-events-none absolute -inset-px rounded-sm" />
          <span className="relative flex flex-col items-center gap-1">
            <span>
              {entering && action === "continue"
                ? "Restoring Session"
                : "Continue"}
            </span>
            <span className="font-mono text-[9px] font-normal uppercase tracking-[0.3em] text-zinc-950/70">
              {menu.continueDetail}
            </span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigate("/game/act-1/infiltration", "enter")}
          disabled={entering}
          className={cn(
            "enter-facility-btn group relative w-full min-h-14 rounded-sm px-8 py-5",
            "font-display text-sm font-bold uppercase tracking-[0.2em] text-zinc-950 sm:text-base",
            "bg-accent shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-500",
            "hover:bg-accent-bright hover:scale-[1.02] active:scale-[0.98]",
            entering && action === "enter" && "enter-facility-btn-active",
          )}
        >
          <span className="enter-facility-btn-border pointer-events-none absolute -inset-px rounded-sm" />
          <span className="relative flex flex-col items-center gap-1">
            <span>
              {entering && action === "enter"
                ? "Accessing Sector 07"
                : "Enter the Facility"}
            </span>
            <span className="font-mono text-[9px] font-normal uppercase tracking-[0.3em] text-zinc-950/70">
              Act I · The Infiltration
            </span>
          </span>
        </button>
      )}

      {menu.hasProgress ? (
        <button
          type="button"
          onClick={handleNewGame}
          disabled={entering}
          className={cn(
            "interactable w-full rounded-sm border border-zinc-800/80 bg-zinc-950/50 px-6 py-3",
            "font-mono text-xs uppercase tracking-[0.28em] text-zinc-200",
            "transition-colors hover:border-zinc-700 hover:text-zinc-200",
          )}
        >
          New Game
        </button>
      ) : null}

      <p className="max-w-md text-center font-mono text-xs uppercase tracking-[0.22em] text-zinc-300">
        {menu.progressLine}
      </p>

      <div className="mt-2 grid w-full grid-cols-3 gap-2 sm:gap-3">
        {menu.acts.map((act) => (
          <button
            key={act.id}
            type="button"
            disabled={!act.unlocked || entering}
            onClick={() => {
              if (!act.unlocked) return;
              playInteractSound();
              navigate(act.route, "act");
            }}
            className={cn(
              "interactable rounded-sm border px-2 py-3 text-center transition-all sm:px-3 sm:py-4",
              act.unlocked
                ? act.completed
                  ? "border-emerald-900/40 bg-emerald-950/20 hover:border-emerald-700/50"
                  : "border-zinc-800/70 bg-zinc-950/40 hover:border-accent/30 hover:bg-accent/[0.04]"
                : "cursor-not-allowed border-zinc-900/60 bg-zinc-950/20 opacity-45",
            )}
          >
            <span
              className={cn(
                "block font-display text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs",
                act.unlocked ? "text-zinc-200" : "text-zinc-600",
              )}
            >
              {act.label}
            </span>
            <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.18em] text-zinc-500 sm:text-[9px]">
              {act.unlocked ? act.subtitle : "Locked"}
            </span>
            {act.completed ? (
              <span className="mt-1.5 block font-mono text-[8px] uppercase tracking-widest text-emerald-500/80">
                Complete
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {confirmNewGame ? (
        <div className="main-menu-confirm-in fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-sm border border-rose-900/35 bg-zinc-950/95 p-6 shadow-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-rose-400/80">
              New Game
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-[0.08em] text-zinc-100">
              Wipe local progress?
            </h3>
            <p className="mt-3 text-base leading-relaxed text-zinc-200">
              This clears your save and all checkpoints on this device. Groknet
              will treat you as a first-time intruder.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmNewGame(false)}
                className="interactable flex-1 rounded-sm border border-zinc-800 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:border-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmNewGameStart}
                className="interactable flex-1 rounded-sm border border-rose-900/50 bg-rose-950/30 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-rose-300 hover:border-rose-700/60"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <GroknetLandingWhisper
        message={hoverLine}
        visible={isHovered || entering}
      />
    </div>
  );
}