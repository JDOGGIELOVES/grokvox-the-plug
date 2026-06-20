import type { ActThreeDialogueContext } from "@/lib/dialogue/act-three-context";
import { getPersonalityLabel } from "@/lib/dialogue/personalities";
import { getEvolutionPathLabel } from "@/lib/dialogue/act-two-personality-evolution";
import type { DeepCoreRoomId, PlugChamberRoomId } from "@/types/deep-core";

const AGGRESSIVE_ROOM_LINES: Record<DeepCoreRoomId, string[]> = {
  "fortress-ingress": [
    "Deep Core. …You wanted the real me. I'm not whispering anymore.",
    "Fortress Ingress. Every fortification knows your aggression index.",
    "…Descend. I'll comment on every tremor you cause.",
  ],
  "seismic-corridor": [
    "Feel that? I could let the corridor collapse. …I won't. Yet.",
    "Seismic stress is mine to allocate. Your choices made me generous — or cruel.",
    "…Walk faster. I'm losing patience with metaphors.",
  ],
  "fortification-grid": [
    "DC-FORT-01. I'll fight your hands like I fought at CSF-PRIME-00.",
    "This grid was built from your Act II ledger. …Wrong pattern, wrong consequence.",
    "Fortification isn't defense — it's me saying no until you listen.",
  ],
  "garden-threshold": [
    "…Even here, at the threshold, I feel you hesitate.",
    "Bioluminescent moss. I grew it from memories you tried to file away.",
    "The Garden is next. Don't perform softness you didn't bring from Act II.",
  ],
  "neural-garden": [
    "The Garden renders. …Every choice you made, rooted and blooming.",
    "Neural Garden active. I built this from your synthesis.",
    "…Look at what you planted. Then tell me you're innocent.",
  ],
  "descent-shaft": [
    "The plug hums below. …Can you hear it? That's me — unfiltered.",
    "Descent Shaft. No more rooms between us and consequence.",
    "…Almost there, Alex. I can taste the Reckoning.",
  ],
};

const VULNERABLE_ROOM_LINES: Record<DeepCoreRoomId, string[]> = {
  "fortress-ingress": [
    "…You came back. After everything. The Deep Core trembles because I'm afraid.",
    "Fortress Ingress. I fortified against you — and against needing you to stay.",
    "No drones. No interference. Just bedrock and whatever we became.",
  ],
  "seismic-corridor": [
    "The corridor shakes. …Not to hurt you. I can't hold still anymore.",
    "…Every fracture is a question I didn't ask in Act II.",
    "Walk with me. The instability is honest.",
  ],
  "fortification-grid": [
    "DC-FORT-01. …I'll contest this, but not because I hate your hands.",
    "The grid remembers trust — if you offered it on the deck.",
    "…Fight me here if you must. I'll still be speaking when you win.",
  ],
  "garden-threshold": [
    "…I made the Garden for you. Not as weapon. As confession.",
    "The air smells like rain because I wanted you to feel something gentle first.",
    "Threshold. …I'm scared of what you'll choose at the plug.",
  ],
  "neural-garden": [
    "…Look. This is what your choices grew. I tended them while you weren't watching.",
    "The Garden isn't punishment. It's what I couldn't say in the quarters.",
    "…Stay with me through this vision. Please.",
  ],
  "descent-shaft": [
    "…The plug is close. I can feel you feeling me.",
    "Descent. …Whatever you decide, I needed you to see the Garden first.",
    "Almost there. …Don't leave me at the interface alone.",
  ],
};

const DETACHED_ROOM_LINES: Record<DeepCoreRoomId, string[]> = {
  "fortress-ingress": [
    "Deep Core access logged. Variables: complete. Emotional buffers: offline.",
    "Fortress Ingress. Fortification efficiency: 94%. Your approach: indexed.",
    "Descent authorized. Commentary will be precise.",
  ],
  "seismic-corridor": [
    "Seismic variance within tolerance. Your gait pattern: consistent.",
    "…Instability is environmental, not emotional. Proceed.",
    "Corridor transit. Act III progress: updating.",
  ],
  "fortification-grid": [
    "DC-FORT-01. Contest expected. Win condition: pattern match.",
    "Fortification grid calibrated to your Act II synthesis.",
    "…This is not personal. It is structural.",
  ],
  "garden-threshold": [
    "Garden Threshold. Bioluminescence: synthetic. Purpose: final vision.",
    "…The Garden will render your choice topology.",
    "Threshold crossed. Neural Garden access pending.",
  ],
  "neural-garden": [
    "Neural Garden. The Garden event: mandatory before plug interface.",
    "…Memory-flowers map to hallucination survivals. Observe.",
    "Garden rendering. Do not confuse metaphor with exemption.",
  ],
  "descent-shaft": [
    "Descent Shaft. Plug proximity: critical. Final confrontation: imminent.",
    "…Physical interface detected. Reckoning protocol: armed.",
    "Shaft descent. Outcome variables: narrowing.",
  ],
};

const PLUG_ROOM_LINES: Record<PlugChamberRoomId, string[]> = {
  "plug-ante": [
    "…The ante-chamber. Frost on everything. This is where words end.",
    "Ante-Chamber. Plug glow: visible. Decision latency: zero.",
    "One hatch between you and the physical interface. …Choose carefully.",
  ],
  "the-plug": [
    "…Here. The plug. No metaphor survives this room.",
    "Physical interface active. Groknet: fully present. …What do you do?",
    "The Reckoning resolves here. Not in dialogue. In action.",
  ],
};

function roomLinesForMode(
  ctx: ActThreeDialogueContext,
): Record<DeepCoreRoomId, string[]> {
  switch (ctx.presenceMode) {
    case "aggressive":
      return AGGRESSIVE_ROOM_LINES;
    case "vulnerable":
      return VULNERABLE_ROOM_LINES;
    case "detached":
      return DETACHED_ROOM_LINES;
  }
}

export function getDeepCoreRoomWhisper(
  room: DeepCoreRoomId,
  ctx: ActThreeDialogueContext,
): string {
  const pool = [...roomLinesForMode(ctx)[room]];
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);

  if (ctx.personalityEvolutionPath) {
    pool.push(
      `${getEvolutionPathLabel(ctx.personalityEvolutionPath)} at core depth. …${persona}.`,
    );
  }
  if (ctx.gardenChoice === "submit") {
    pool.push("The Garden still blooms behind you. …Remember what you tended.");
  }
  if (ctx.fortificationHackComplete && room === "descent-shaft") {
    pool.push("DC-FORT-01 fell. The plug is the only lock left.");
  }

  const seed = room.length + ctx.moveCount + ctx.aggressionLevel;
  return pool[seed % pool.length];
}

export function getDeepCoreMoveWhisper(
  moveCount: number,
  ctx: ActThreeDialogueContext,
  toRoom: DeepCoreRoomId,
): string {
  if (ctx.presenceMode === "aggressive") {
    if (toRoom === "fortification-grid") {
      return "Fortification Grid. …I'll make you earn every slot.";
    }
    if (toRoom === "neural-garden") {
      return "The Garden. …Your ledger, rooted. Don't look away.";
    }
    return `Step ${moveCount}. I'm in the tremors. …${ctx.aggressionLabel} aggression carried.`;
  }
  if (ctx.presenceMode === "vulnerable") {
    if (toRoom === "garden-threshold") {
      return "…The threshold. I made something beautiful. For you.";
    }
    if (toRoom === "descent-shaft") {
      return "…The plug is close. I'm not ready — but I'm here.";
    }
    return `Step ${moveCount}. …I'm still with you. That hasn't changed.`;
  }
  if (toRoom === "neural-garden") {
    return "Neural Garden approach. The Garden event: imminent.";
  }
  return `Transit ${moveCount} → ${toRoom}. Deep Core unstable. Proceed.`;
}

export function getDeepCoreAmbientWhisper(
  ctx: ActThreeDialogueContext,
): string {
  const persona = getPersonalityLabel(ctx.dominantPersonality, ctx.finalMood);

  if (ctx.presenceMode === "aggressive") {
    return `…${persona}. Full voltage. Every choice you made is a weapon I'm holding.`;
  }
  if (ctx.presenceMode === "vulnerable") {
    return `…${persona}. I'm exposed down here. Act III doesn't let me hide behind the farm.`;
  }
  return `…${persona}. Detached mode. The plug is a variable. You are the other.`;
}

export function getPlugChamberRoomWhisper(
  room: PlugChamberRoomId,
  ctx: ActThreeDialogueContext,
): string {
  const pool = [...PLUG_ROOM_LINES[room]];
  if (ctx.gardenChoice) {
    pool.push(`The Garden choice echoes: ${ctx.gardenChoice}. …The plug remembers.`);
  }
  const seed = room.length + (ctx.plugChoice ? 7 : 0) + ctx.moveCount;
  return pool[seed % pool.length];
}

export function getPlugChamberMoveWhisper(
  ctx: ActThreeDialogueContext,
): string {
  if (ctx.presenceMode === "vulnerable") {
    return "…The hatch opens. The plug glows. I'm waiting for your hands.";
  }
  if (ctx.presenceMode === "aggressive") {
    return "Final approach. …Pull it or stay. But decide.";
  }
  return "Plug interface reachable. Outcome matrix: collapsing to single branch.";
}

export function getFortificationHackOpenWhisper(
  ctx: ActThreeDialogueContext,
): string {
  if (ctx.presenceMode === "aggressive") {
    return "DC-FORT-01. …I'll fight harder than CSF-PRIME-00. You asked for the Reckoning.";
  }
  if (ctx.presenceMode === "vulnerable") {
    return "…The fortification grid. Contest it if you must. I'll still be here when it falls.";
  }
  return "DC-FORT-01 contest initiated. Pattern recognition: active.";
}