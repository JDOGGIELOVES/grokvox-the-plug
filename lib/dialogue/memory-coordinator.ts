import { responseFingerprint } from "@/lib/dialogue/response-picker";

function isStaleMemory(line: string, recentResponses: string[]): boolean {
  const fp = responseFingerprint(line);
  return recentResponses.some((r) => {
    const prior = responseFingerprint(r);
    return prior.includes(fp.slice(0, 40)) || fp.includes(prior.slice(0, 40));
  });
}

export function composeMemoryPrefix(
  candidates: (string | null | undefined)[],
  recentResponses: string[],
  hash: number,
  maxLines = 2,
): string {
  const valid = candidates.filter((c): c is string => Boolean(c?.trim()));

  const fresh: string[] = [];
  for (let i = 0; i < valid.length && fresh.length < maxLines; i++) {
    const idx = (hash + i) % valid.length;
    const line = valid[idx];
    if (!line || isStaleMemory(line, recentResponses)) continue;
    if (fresh.includes(line)) continue;
    fresh.push(line);
  }

  if (!fresh.length) {
    const fallback = valid.find((l) => !fresh.includes(l));
    if (fallback) fresh.push(fallback);
  }

  return fresh.join(" ");
}