import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groknet: The Plug — Play",
  description:
    "Act I: The Infiltration · Act II: The Conversation · Act III: The Reckoning. Survive Sector 07 and confront Groknet at the Plug.",
};

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}