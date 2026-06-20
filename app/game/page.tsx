"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGameResumeTarget } from "@/lib/game-resume";

export default function GamePage() {
  const router = useRouter();

  useEffect(() => {
    const target = getGameResumeTarget();
    router.replace(target.route);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-zinc-500">
        Groknet routing your session…
      </p>
    </div>
  );
}