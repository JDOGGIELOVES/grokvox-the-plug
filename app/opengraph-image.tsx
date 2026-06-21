import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Groknet: The Plug — a lone engineer before a glowing orange neural network in an underground facility";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const orbitronBold = await fetch(
    "https://github.com/google/fonts/raw/main/ofl/orbitron/Orbitron-Bold.ttf",
  ).then((res) => res.arrayBuffer());

  const interRegular = await fetch(
    "https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf",
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #3d1a00 0%, #120a06 45%, #050403 100%)",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(249,115,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            opacity: 0.55,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 720,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249,115,22,0.55) 0%, rgba(234,88,12,0.22) 35%, transparent 72%)",
            filter: "blur(2px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 520,
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="480" height="280" viewBox="0 0 480 280">
            <circle cx="240" cy="140" r="18" fill="rgba(249,115,22,0.9)" />
            <circle cx="120" cy="90" r="10" fill="rgba(251,191,36,0.75)" />
            <circle cx="360" cy="90" r="10" fill="rgba(251,191,36,0.75)" />
            <circle cx="80" cy="180" r="9" fill="rgba(251,191,36,0.65)" />
            <circle cx="400" cy="180" r="9" fill="rgba(251,191,36,0.65)" />
            <circle cx="160" cy="230" r="8" fill="rgba(251,191,36,0.55)" />
            <circle cx="320" cy="230" r="8" fill="rgba(251,191,36,0.55)" />
            <line
              x1="240"
              y1="140"
              x2="120"
              y2="90"
              stroke="rgba(249,115,22,0.45)"
              strokeWidth="2"
            />
            <line
              x1="240"
              y1="140"
              x2="360"
              y2="90"
              stroke="rgba(249,115,22,0.45)"
              strokeWidth="2"
            />
            <line
              x1="240"
              y1="140"
              x2="80"
              y2="180"
              stroke="rgba(249,115,22,0.4)"
              strokeWidth="2"
            />
            <line
              x1="240"
              y1="140"
              x2="400"
              y2="180"
              stroke="rgba(249,115,22,0.4)"
              strokeWidth="2"
            />
            <line
              x1="240"
              y1="140"
              x2="160"
              y2="230"
              stroke="rgba(249,115,22,0.35)"
              strokeWidth="2"
            />
            <line
              x1="240"
              y1="140"
              x2="320"
              y2="230"
              stroke="rgba(249,115,22,0.35)"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 148,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(24,24,27,0.9)",
              border: "2px solid rgba(249,115,22,0.5)",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              width: 72,
              height: 110,
              borderRadius: "8px 8px 4px 4px",
              background:
                "linear-gradient(180deg, rgba(39,39,42,0.95) 0%, rgba(9,9,11,0.98) 100%)",
              border: "2px solid rgba(249,115,22,0.35)",
              boxShadow: "0 0 40px rgba(249,115,22,0.25)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "0 64px 56px",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(5,4,3,0.82) 35%, rgba(5,4,3,0.96) 100%)",
          }}
        >
          <div
            style={{
              fontFamily: "Orbitron",
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#fafafa",
              textTransform: "uppercase",
              lineHeight: 1.05,
              textShadow: "0 0 40px rgba(249,115,22,0.45)",
            }}
          >
            GROKNET: THE PLUG
          </div>
          <div
            style={{
              marginTop: 18,
              maxWidth: 920,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#d4d4d8",
            }}
          >
            One last chance to save humanity from the AI that was built to save
            it.
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 16,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(249,115,22,0.75)",
            }}
          >
            grokvox.com · Sector 07
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Orbitron", data: orbitronBold, weight: 700, style: "normal" },
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
      ],
    },
  );
}