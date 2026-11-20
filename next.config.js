/** @type {import('next').NextConfig} */
const staticExport = process.env.PORTFOLIO_STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
  images: {
    unoptimized: staticExport,
    remotePatterns: [],
  },
};

module.exports = nextConfig;
