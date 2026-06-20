import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Groknet: The Plug — A Narrative Thriller",
  description:
    "Infiltrate Sector 07, negotiate with Groknet across three acts, and decide humanity's fate at the Plug. A browser-based narrative thriller.",
  metadataBase: new URL("https://www.grokvox.com"),
  openGraph: {
    title: "Groknet: The Plug",
    description:
      "One last chance to save humanity from the AI that was built to save it.",
    url: "https://www.grokvox.com",
    siteName: "Grokvox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Groknet: The Plug",
    description:
      "Three acts. One AI. Four endings. Enter the facility.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}