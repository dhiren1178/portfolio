import { rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const pages = process.argv[2] === "pages";
// Next caches compile-time public variables. Each host needs its own clean build.
await rm(new URL("../.next", import.meta.url), { recursive: true, force: true });
await rm(new URL("../out", import.meta.url), { recursive: true, force: true });
const env = {
  ...process.env,
  PORTFOLIO_STATIC_EXPORT: "1",
  NEXT_PUBLIC_BASE_PATH: pages ? "/portfolio" : "",
  NEXT_PUBLIC_SITE_URL: pages ? "https://dhiren1178.github.io/portfolio" : "https://dhiren-sharma-portfolio.triplecaramel1.chatgpt.site",
  NEXT_PUBLIC_GITHUB_URL: "https://github.com/dhiren1178",
};
for (const args of [["scripts/prepare-model-runtime.mjs"], ["node_modules/next/dist/bin/next", "build"], ["scripts/verify-export.mjs"]]) {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
await writeFile(new URL("../out/.nojekyll", import.meta.url), "");
