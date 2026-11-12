import type { Metadata } from "next";

// Neutral title so the WhatsApp link preview doesn't give the drill away.
export const metadata: Metadata = {
  title: "Message details",
  description: "Tap to view details.",
  robots: { index: false, follow: false },
};

export default function DrillLayout({ children }: { children: React.ReactNode }) {
  return children;
}