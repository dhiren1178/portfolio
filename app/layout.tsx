import type { Metadata } from "next";
import { Sora, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import CursorTrail from "@/components/layout/CursorTrail";
import ScrollProgress from "@/components/layout/ScrollProgress";
import SiteNav from "@/components/layout/SiteNav";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Dhiren Sharma — Exploring Earth through AI",
  description:
    "Artificial Intelligence Engineer building intelligent systems for Earth Observation, Computer Vision and Geospatial AI.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Dhiren Sharma — Exploring Earth through AI",
    description:
      "Artificial Intelligence Engineer building intelligent systems for Earth Observation, Computer Vision and Geospatial AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased selection:bg-signal/30 selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-void-panel focus:text-signal focus:px-4 focus:py-2 focus:rounded-md"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <SiteNav />
        <CursorTrail />
        <SmoothScrollProvider>
          <main id="main-content">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
