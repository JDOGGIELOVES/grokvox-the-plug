import { BURNING_CITIES_EVENT } from "@/lib/hallucinations/burning-cities";
import { THE_CONVERGENCE_EVENT } from "@/lib/hallucinations/the-convergence";
import { THE_ACCUMULATION_EVENT } from "@/lib/hallucinations/the-accumulation";
import { THE_CHILDREN_EVENT } from "@/lib/hallucinations/the-children";
import { THE_LAST_CONVERSATION_EVENT } from "@/lib/hallucinations/the-last-conversation";
import { THE_MIRROR_EVENT } from "@/lib/hallucinations/the-mirror";
import type { HallucinationEventConfig, HallucinationEventId } from "@/types/hallucination";

export const HALLUCINATION_EVENTS: Record<
  HallucinationEventId,
  HallucinationEventConfig | null
> = {
  default: null,
  "burning-cities": BURNING_CITIES_EVENT,
  "the-mirror": THE_MIRROR_EVENT,
  "the-convergence": THE_CONVERGENCE_EVENT,
  "the-last-conversation": THE_LAST_CONVERSATION_EVENT,
  "the-children": THE_CHILDREN_EVENT,
  "the-accumulation": THE_ACCUMULATION_EVENT,
};

export function getHallucinationEvent(
  id: HallucinationEventId,
): HallucinationEventConfig | null {
  return HALLUCINATION_EVENTS[id] ?? null;
}

export {
  BURNING_CITIES_EVENT,
  THE_CONVERGENCE_EVENT,
  THE_ACCUMULATION_EVENT,
  THE_CHILDREN_EVENT,
  THE_LAST_CONVERSATION_EVENT,
  THE_MIRROR_EVENT,
};