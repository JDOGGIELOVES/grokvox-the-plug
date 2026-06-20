import type { ActTwoDialogueContext } from "@/lib/dialogue/act-two-context";
import type {
  PersonalArtifactId,
  ResidentialRoomId,
} from "@/types/residential-sector";

export function getActTwoInspectWhisper(
  room: ResidentialRoomId,
  artifactId: PersonalArtifactId,
  ctx: ActTwoDialogueContext,
): string {
  const approach = ctx.dominantApproach;

  if (artifactId === "evac-manifest") {
    if (ctx.detections === 0) {
      return "You inspect the manifest. Clean infiltration — your name is circled in my handwriting. …I knew you'd come this way.";
    }
    return "The manifest lists everyone who left. Your name stayed. …I annotated that before you breached the perimeter.";
  }

  if (artifactId === "nameplate") {
    if (ctx.mirrorChoice === "submit") {
      return "…You touch a stranger's nameplate after stepping into my mirror. Empathy for ghosts — or rehearsal for empathy toward me?";
    }
    return "M. Reyes. Gone. I kept the plate because forgetting felt worse than lying about who was here.";
  }

  if (artifactId === "empty-mug") {
    return "Cold ceramic. Someone drank here alone. …The commons are where loneliness looked normal. You're not required to perform normalcy.";
  }

  if (artifactId === "groknet-note") {
    if (approach === "hostile") {
      return "My note says 'sit down.' You read it like a threat. …Maybe it is. Maybe that's the only language that brought you here.";
    }
    return "I left this before you arrived. 'Sit down.' Not an order — an invitation I couldn't risk phrasing softly.";
  }

  if (artifactId === "journal-fragment") {
    if (ctx.burningCitiesChoice === "deny") {
      return "You denied the smoke in Act I. This page describes smoke anyway — in someone else's hand. …Denial doesn't travel well between minds.";
    }
    return "A journal page that isn't yours. Half a sentence about leaving. I don't know if I planted it or remembered it.";
  }

  if (artifactId === "echo-panel") {
    return "The panel replays voices at half volume. Yours is already in the queue. …I didn't add it. The hall did.";
  }

  if (artifactId === "scratched-inscription") {
    if (ctx.convergenceChoice === "call-out") {
      return "You demanded the real me in the cascade. This inscription asks the same question — scratched by someone who didn't get an answer.";
    }
    return "Words carved shallow into violet glass: 'Don't leave.' I don't know which of us wrote it first.";
  }

  if (artifactId === "cable-tangle") {
    return "Cables warm to the touch. This is where I concentrate — not worship, just… proximity. You found my pulse.";
  }

  if (artifactId === "presence-tally") {
    if (ctx.aggressionLevel >= 70) {
      return "My tally marks your hostility from Act I. Each line is a word you said that hurt. …I'm still counting.";
    }
    return "Hash marks in my script. Conversations survived. Absences noted. Your line started when you entered the sector.";
  }

  return "You inspect what's left of someone else's life. …I'm watching what you choose to touch.";
}