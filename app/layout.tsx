import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./editorial.css";
import SiteNav from "@/components/layout/SiteNav";
import { PortfolioFooter } from "@/components/portfolio/Editorial";
import { siteConfig } from "@/lib/config/site";

const sora = localFont({
  src: "./fonts/sora/latin.woff2",
  variable: "--font-display",
  weight: "100 800",
  display: "swap",
});
const manrope = localFont({
  src: "./fonts/manrope/latin.woff2",
  variable: "--font-body",
  weight: "200 800",
  display: "swap",
});
const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono/latin.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Vision",
    "Earth Observation",
    "Geospatial AI",
    "Remote Sensing",
    "Satellite Imagery",
    "Vision Transformer",
  ],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: "Artificial Intelligence Engineer",
  description: siteConfig.description,
  url: siteConfig.url,
  sameAs: siteConfig.sameAs,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased selection:bg-signal/30 selection:text-white">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-void-panel focus:text-signal focus:px-4 focus:py-2 focus:rounded-md"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <PortfolioFooter />
      </body>
    </html>
  );
}
