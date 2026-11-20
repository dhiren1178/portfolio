/**
 * Single source of truth for site-wide identity used across metadata,
 * sitemap.ts, robots.ts, and structured data — avoids the same title,
 * description, and URL being duplicated (and drifting) across files.
 *
 * NEXT_PUBLIC_SITE_URL supplies the public origin at deployment.
 */
export const siteConfig = {
  name: "Dhiren Sharma",
  title: "Dhiren Sharma — Exploring Earth through AI",
  description:
    "Artificial Intelligence Engineer building intelligent systems for Earth Observation, Computer Vision and Geospatial AI.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  sameAs: [
    "https://www.linkedin.com/in/dhirensharma01/",
    ...(process.env.NEXT_PUBLIC_GITHUB_URL ? [process.env.NEXT_PUBLIC_GITHUB_URL] : []),
  ],
};

export const routes = [
  { path: "/", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/projects", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/projects/vegetation-height", changeFrequency: "yearly" as const, priority: 0.9 },
  { path: "/projects/sign-language", changeFrequency: "yearly" as const, priority: 0.9 },
  { path: "/mission", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/research", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/projects/devpilot-ai", changeFrequency: "yearly" as const, priority: 0.8 },
  { path: "/projects/ticket-classification", changeFrequency: "yearly" as const, priority: 0.8 },
  { path: "/experience", changeFrequency: "yearly" as const, priority: 0.7 },
  { path: "/skills", changeFrequency: "yearly" as const, priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly" as const, priority: 0.7 },
];
