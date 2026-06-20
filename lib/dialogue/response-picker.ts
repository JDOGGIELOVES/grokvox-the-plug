export function responseFingerprint(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s…]/g, "")
    .trim()
    .slice(0, 96);
}

function isRecentlyUsed(
  candidate: string,
  recentResponses: string[],
): boolean {
  const fp = responseFingerprint(candidate);
  if (!fp) return false;
  return recentResponses.some((r) => {
    const prior = responseFingerprint(r);
    if (prior === fp) return true;
    if (prior.includes(fp) || fp.includes(prior)) return true;
    return false;
  });
}

export function pickUniqueFromPool(
  pool: string[],
  recentResponses: string[],
  hash: number,
): string {
  if (!pool.length) return "";

  let available = pool.filter((line) => !isRecentlyUsed(line, recentResponses));
  if (!available.length) {
    available = pool.filter(
      (line, i) => i !== hash % pool.length || pool.length === 1,
    );
    if (!available.length) available = pool;
  }

  const start = hash % available.length;
  for (let i = 0; i < available.length; i++) {
    const pick = available[(start + i) % available.length];
    if (!isRecentlyUsed(pick, recentResponses)) return pick;
  }

  return available[start];
}

export function pickUniqueTemplate(
  templates: string[],
  recentResponses: string[],
  hash: number,
  filled: string,
): string {
  const available = templates.filter(
    (t) => !isRecentlyUsed(t.replace(/\{[^}]+\}/g, "x"), recentResponses),
  );
  const pool = available.length ? available : templates;
  return pool[hash % pool.length].replace(/\{phrase\}/g, filled);
}