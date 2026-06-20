import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groknet: The Plug — Act I",
  description:
    "Act I: The Infiltration. Survive Sector 07, negotiate with Groknet, and seal the Data Archives.",
};

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}