import type { GroknetMood } from "@/lib/groknet";
import type { AggressionState } from "@/types/chapter";

type AggressionInput = {
  mood: GroknetMood;
  detections: number;
  exchangeCount: number;
  hallucinationActive: boolean;
};

export function calculateAggression({
  mood,
  detections,
  exchangeCount,
  hallucinationActive,
}: AggressionInput): AggressionState {
  let level = 38;
  level += mood.cold * 12;
  level += Math.min(detections * 7, 28);
  level += Math.min(exchangeCount * 2, 14);
  level -= mood.melancholic * 4;
  level = Math.max(12, Math.min(100, level));

  if (hallucinationActive) {
    return { level: Math.min(100, level + 22), label: "Surging" };
  }
  if (level >= 78) return { level, label: "Critical" };
  if (level >= 58) return { level, label: "Elevated" };
  if (level >= 38) return { level, label: "Medium" };
  return { level, label: "Low" };
}