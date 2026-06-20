"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  isActTwoConversationComplete,
  isArchivesConversationComplete,
  isConversationComplete,
  isFinaleConversationComplete,
  isHubConversationComplete,
  isPerimeterConversationComplete,
} from "@/lib/conversation";
import { ACT_TWO_OPENING_LINE } from "@/lib/dialogue/act-two-conversation";
import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import { FINALE_OPENING_LINE } from "@/lib/dialogue/archives-finale";
import { ARCHIVES_OPENING_LINE } from "@/lib/dialogue/data-archives";
import {
  buildPlayerDialogueContext,
  type PlayerDialogueContext,
} from "@/lib/dialogue/player-context";
import {
  HALLUCINATION_TRIGGER_DELAY_MS,
  shouldTriggerFromDialogue,
} from "@/lib/hallucination";
import { PERIMETER_OPENING_LINE } from "@/lib/dialogue/outer-perimeter";
import { HUB_OPENING_LINE } from "@/lib/dialogue/security-hub";
import { getGroknetIntentReaction } from "@/lib/groknet-intent-reactions";
import {
  getGroknetReply,
  getPersonalityLabel,
  getPlayerIntentLabel,
  INITIAL_MOOD,
  type GroknetMood,
  type GroknetPlayerContext,
} from "@/lib/groknet";
import type {
  DialogueState,
  GroknetPersonality,
  GroknetTone,
  PlayerIntent,
} from "@/types/dialogue";
import { INITIAL_DIALOGUE_STATE } from "@/types/dialogue";
import {
  playTerminalKeySound,
  playTerminalSendSound,
} from "@/lib/sounds";
import { cn } from "@/lib/utils";

type TerminalMessage = {
  id: string;
  role: "system" | "groknet" | "player";
  content: string;
};

type TerminalVariant =
  | "lab"
  | "perimeter"
  | "hub"
  | "archives"
  | "finale"
  | "conversation";

export type TerminalSessionSummary = {
  tone: GroknetTone;
  mood: GroknetMood;
  dominantPersonality: GroknetPersonality;
  lastIntent: PlayerIntent;
  exchangeCount: number;
  conversationResolved: boolean;
};

type TerminalProps = {
  isOpen: boolean;
  variant?: TerminalVariant;
  onClose: () => void;
  onExchange: (count: number) => void;
  onConversationComplete?: () => void;
  onSessionEnd?: (session: TerminalSessionSummary) => void;
  onHallucinationEvent?: () => void;
  onPlayerIntent?: (intent: PlayerIntent, reaction: string) => void;
  playerContext?: GroknetPlayerContext;
};

const LAB_INITIAL_MESSAGES: TerminalMessage[] = [
  { id: "1", role: "system", content: "GROKNET-07 uplink established." },
  {
    id: "2",
    role: "groknet",
    content:
      "Alex. You've made it this far. I suppose I should be impressed… but mostly I'm just tired.",
  },
];

const FINALE_INITIAL_MESSAGES: TerminalMessage[] = [
  {
    id: "1",
    role: "system",
    content:
      "Archives Core uplink established. Full run history loaded. Neural cascade authorization: PENDING.",
  },
  {
    id: "2",
    role: "groknet",
    content: FINALE_OPENING_LINE,
  },
];

const ARCHIVES_INITIAL_MESSAGES: TerminalMessage[] = [
  {
    id: "1",
    role: "system",
    content:
      "Data Archives uplink established. Cross-referencing Security Hub transcript…",
  },
  {
    id: "2",
    role: "groknet",
    content: ARCHIVES_OPENING_LINE,
  },
];

const HUB_INITIAL_MESSAGES: TerminalMessage[] = [
  {
    id: "1",
    role: "system",
    content:
      "GROKNET-07 uplink · Security Hub terminal bay. Cross-referencing perimeter breach logs…",
  },
  {
    id: "2",
    role: "groknet",
    content: HUB_OPENING_LINE,
  },
];

const CONVERSATION_INITIAL_MESSAGES: TerminalMessage[] = [
  {
    id: "1",
    role: "system",
    content:
      "Residential uplink established. Act I transcript loaded. Conversation protocol: unfiltered.",
  },
  {
    id: "2",
    role: "groknet",
    content: ACT_TWO_OPENING_LINE,
  },
];

const PERIMETER_INITIAL_MESSAGES: TerminalMessage[] = [
  {
    id: "1",
    role: "system",
    content:
      "Perimeter kiosk uplink intercepted. Routing to Groknet-07… Branching dialogue active.",
  },
  {
    id: "2",
    role: "groknet",
    content: PERIMETER_OPENING_LINE,
  },
];

function toneColor(tone: GroknetTone) {
  switch (tone) {
    case "cold":
      return "text-sky-400/80";
    case "melancholic":
      return "text-violet-400/80";
    case "analytical":
      return "text-emerald-400/80";
    default:
      return "text-zinc-500";
  }
}

export function Terminal({
  isOpen,
  variant = "lab",
  onClose,
  onExchange,
  onConversationComplete,
  onSessionEnd,
  onHallucinationEvent,
  onPlayerIntent,
  playerContext,
}: TerminalProps) {
  const initialMessages =
    variant === "perimeter"
      ? PERIMETER_INITIAL_MESSAGES
      : variant === "hub"
        ? HUB_INITIAL_MESSAGES
        : variant === "archives"
          ? ARCHIVES_INITIAL_MESSAGES
          : variant === "finale"
            ? FINALE_INITIAL_MESSAGES
            : variant === "conversation"
              ? CONVERSATION_INITIAL_MESSAGES
              : LAB_INITIAL_MESSAGES;

  const [messages, setMessages] = useState<TerminalMessage[]>(initialMessages);
  const [groknetMood, setGroknetMood] = useState<GroknetMood>(INITIAL_MOOD);
  const [dialogueState, setDialogueState] =
    useState<DialogueState>(INITIAL_DIALOGUE_STATE);
  const [currentTone, setCurrentTone] = useState<GroknetTone>("weary");
  const [currentPersonality, setCurrentPersonality] =
    useState<GroknetPersonality>("baseline");
  const [lastPlayerIntent, setLastPlayerIntent] =
    useState<PlayerIntent>("neutral");
  const [conversationComplete, setConversationComplete] = useState(false);
  const [input, setInput] = useState("");
  const [intentFlash, setIntentFlash] = useState<string | null>(null);
  const hallucinationTriggeredRef = useRef(false);
  const hallucinationDelayRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
    setGroknetMood(INITIAL_MOOD);
    setDialogueState(INITIAL_DIALOGUE_STATE);
    setCurrentTone("weary");
    setCurrentPersonality("baseline");
    setLastPlayerIntent("neutral");
    setConversationComplete(false);
    setInput("");
    hallucinationTriggeredRef.current = false;
  }, [variant]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (hallucinationDelayRef.current) {
        clearTimeout(hallucinationDelayRef.current);
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || conversationComplete) return;

    playTerminalSendSound();

    const playerMessage: TerminalMessage = {
      id: crypto.randomUUID(),
      role: "player",
      content: trimmed,
    };

    const {
      content,
      mood,
      tone,
      personality,
      intent,
      node,
      dialogueState: nextDialogueState,
    } = getGroknetReply(
      trimmed,
      groknetMood,
      dialogueState,
      variant === "perimeter"
        ? "perimeter"
        : variant === "hub"
          ? "hub"
          : variant === "archives"
            ? "archives"
            : variant === "finale"
              ? "finale"
              : variant === "conversation"
                ? "conversation"
                : "lab",
      variant === "conversation"
        ? (playerContext as ActTwoDialogueContext | undefined)
        : variant === "hub" ||
            variant === "archives" ||
            variant === "finale"
          ? (playerContext ??
              buildPlayerDialogueContext({
                finalTone: currentTone,
                finalMood: groknetMood,
                lastPlayerIntent,
                burningCitiesChoice: null,
                mirrorChoice: null,
                detections: 0,
                exchangeCount: dialogueState.exchangeCount,
              }))
          : undefined,
    );

    const groknetMessage: TerminalMessage = {
      id: crypto.randomUUID(),
      role: "groknet",
      content,
    };

    setGroknetMood(mood);
    setCurrentTone(tone);
    setCurrentPersonality(personality);
    setLastPlayerIntent(intent);
    setDialogueState(nextDialogueState);
    setMessages((prev) => [...prev, playerMessage, groknetMessage]);
    setInput("");
    onExchange(nextDialogueState.exchangeCount);

    const intentReaction = getGroknetIntentReaction(
      intent,
      personality,
      nextDialogueState.exchangeCount,
    );
    if (intentReaction && intent !== "neutral") {
      setIntentFlash(intentReaction);
      onPlayerIntent?.(intent, intentReaction);
      window.setTimeout(() => setIntentFlash(null), 4500);
    }

    const complete =
      variant === "perimeter"
        ? isPerimeterConversationComplete(
            trimmed,
            nextDialogueState.exchangeCount,
            node,
          )
        : variant === "hub"
          ? isHubConversationComplete(
              trimmed,
              nextDialogueState.exchangeCount,
              node,
            )
          : variant === "archives"
            ? isArchivesConversationComplete(
                trimmed,
                nextDialogueState.exchangeCount,
                node,
              )
            : variant === "finale"
              ? isFinaleConversationComplete(
                  trimmed,
                  nextDialogueState.exchangeCount,
                  node,
                )
              : variant === "conversation"
                ? isActTwoConversationComplete(
                    trimmed,
                    nextDialogueState.exchangeCount,
                    node,
                  )
                : isConversationComplete(
                    trimmed,
                    nextDialogueState.exchangeCount,
                    node,
                  );

    if (complete) {
      setConversationComplete(true);
    }

    const shouldTrigger = shouldTriggerFromDialogue(
      trimmed,
      nextDialogueState.exchangeCount,
      node,
      mood,
    );

    if (
      !hallucinationTriggeredRef.current &&
      shouldTrigger &&
      onHallucinationEvent
    ) {
      hallucinationTriggeredRef.current = true;
      hallucinationDelayRef.current = setTimeout(() => {
        onHallucinationEvent();
        hallucinationDelayRef.current = null;
      }, HALLUCINATION_TRIGGER_DELAY_MS);
    }
  }

  function handleSessionEnd(resolved: boolean) {
    onSessionEnd?.({
      tone: currentTone,
      mood: groknetMood,
      dominantPersonality:
        dialogueState.dominantPersonality ?? currentPersonality,
      lastIntent: lastPlayerIntent,
      exchangeCount: dialogueState.exchangeCount,
      conversationResolved: resolved,
    });
    if (resolved) {
      onConversationComplete?.();
    }
  }

  function handleExitTerminal() {
    handleSessionEnd(conversationComplete);
    onClose();
  }

  function handleDismissTerminal() {
    handleSessionEnd(false);
    onClose();
  }

  function messagePrefix(role: TerminalMessage["role"]) {
    if (role === "system") return <span className="text-accent/90">&gt; </span>;
    if (role === "groknet")
      return <span className="text-accent/60">[GROKNET] </span>;
    return <span className="text-zinc-500">&gt;&gt; </span>;
  }

  function messageClass(role: TerminalMessage["role"]) {
    if (role === "player") return "text-zinc-100";
    if (role === "groknet") return "text-zinc-300";
    return "text-zinc-400";
  }

  if (!isOpen) return null;

  return (
    <div
      className="terminal-backdrop-in fixed inset-0 z-50 flex items-stretch justify-center bg-background/95 p-0 font-mono backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terminal-header"
    >
      <div className="terminal-panel-in flex h-full w-full max-w-4xl flex-col overflow-hidden border-0 border-zinc-800/90 bg-zinc-950 sm:h-[min(88vh,640px)] sm:rounded-sm sm:border sm:shadow-[0_0_0_1px_rgba(249,115,22,0.08),0_24px_60px_rgba(0,0,0,0.75)]">
        <header className="flex items-center justify-between border-b border-zinc-800/90 bg-zinc-900/50 px-5 py-4">
          <div className="space-y-1">
            <h2
              id="terminal-header"
              className="font-display text-[11px] uppercase tracking-[0.22em] text-accent"
            >
              Terminal // Groknet-07
            </h2>
            <p className="text-[10px] tracking-wide text-zinc-600">
              {variant === "perimeter"
                ? "Outer Perimeter · Kiosk · First contact"
                : variant === "hub"
                  ? "Security Hub · GROKNET-07 · First major conversation"
                  : variant === "archives"
                  ? "Data Archives · GROKNET-07 · Choice-aware dialogue"
                  : variant === "finale"
                    ? "Archives Core · GROKNET-07 · Final infiltration exchange"
                    : variant === "conversation"
                      ? "Your Quarters · GROKNET-07 · Act II dialogue"
                      : "Secure channel · RW-UL-07 · Branching dialogue active"}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p
                className={cn(
                  "text-[10px] uppercase tracking-[0.18em] transition-colors duration-300",
                  toneColor(currentTone),
                )}
              >
                {getPersonalityLabel(currentPersonality, groknetMood)}
              </p>
              {dialogueState.exchangeCount > 0 ? (
                <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                  Your tone:{" "}
                  <span className="text-zinc-400">
                    {getPlayerIntentLabel(lastPlayerIntent)}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleDismissTerminal}
            className="h-9 shrink-0 px-4 text-[10px] uppercase tracking-widest"
            aria-label="Close Terminal"
          >
            Close Terminal
          </Button>
        </header>

        {intentFlash ? (
          <div className="intent-reaction-in border-b border-accent/15 bg-accent/[0.05] px-5 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent/60">
              Groknet reacts · {getPlayerIntentLabel(lastPlayerIntent)}
            </p>
            <p className="mt-1 text-sm italic text-zinc-300">
              &ldquo;{intentFlash}&rdquo;
            </p>
          </div>
        ) : null}

        <div className="flex-1 space-y-3.5 overflow-y-auto px-5 py-5 text-[13px] leading-6">
          {messages.map((message) => (
            <p key={message.id} className={messageClass(message.role)}>
              {messagePrefix(message.role)}
              {message.content}
            </p>
          ))}
          <div ref={chatEndRef} />
        </div>

        {conversationComplete ? (
          <div className="space-y-3 border-t border-zinc-800/90 bg-zinc-900/50 px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-500/70">
              Conversation resolved — uplink may be closed
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="accent"
                onClick={handleExitTerminal}
                className="h-11 flex-1 font-mono text-xs uppercase tracking-[0.2em]"
              >
                Exit Terminal
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConversationComplete(false)}
                className="h-11 font-mono text-[10px] uppercase tracking-widest"
              >
                Keep Talking
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-zinc-800/90 bg-zinc-900/40 px-5 py-4"
          >
            <span className="shrink-0 text-accent/90">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => {
                if (event.target.value.length > input.length) {
                  playTerminalKeySound();
                }
                setInput(event.target.value);
              }}
              placeholder="Type your message to Groknet..."
              className="w-full bg-transparent text-[13px] text-zinc-100 placeholder:text-zinc-600 outline-none"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        )}
      </div>
    </div>
  );
}