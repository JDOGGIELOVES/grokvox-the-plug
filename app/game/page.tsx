"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getGameResumeTarget } from "@/lib/game-resume";

export default function GamePage() {
  const router = useRouter();
  const [detail, setDetail] = useState("Groknet routing your session…");

  useEffect(() => {
    const target = getGameResumeTarget();
    setDetail(target.detail);
    router.replace(target.route);
  }, [router]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(249,115,22,0.08),transparent_70%)]"
      />
      <div className="relative z-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/70">
          Grokvox Uplink
        </p>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.35em] text-zinc-500">
          {detail}
        </p>
        <span className="mt-6 inline-block h-1 w-24 overflow-hidden rounded-full bg-zinc-900">
          <span className="main-menu-routing-bar block h-full w-1/2 rounded-full bg-accent" />
        </span>
      </div>
    </div>
  );
}