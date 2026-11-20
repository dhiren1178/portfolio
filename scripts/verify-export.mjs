import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve("out");
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const failures = [];
let checked = 0;
async function walk(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) result.push(...await walk(file));
    else result.push(file);
  }
  return result;
}
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith(".html"));
const checksums = JSON.parse(await readFile(new URL("asset-checksums.json", import.meta.url), "utf8"));
for (const [file, expected] of Object.entries(checksums)) {
  try {
    const actual = createHash("sha256").update(await readFile(path.join(root, file))).digest("hex");
    if (actual !== expected) failures.push(`Corrupted or changed asset: ${file}`);
  } catch { failures.push(`Missing asset: ${file}`); }
}
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!raw.startsWith("/") || raw.startsWith("//")) continue;
    const url = raw.split(/[?#]/)[0];
    if (base && url !== base && !url.startsWith(`${base}/`)) {
      failures.push(`${path.relative(root, file)}: path outside ${base}: ${url}`);
      continue;
    }
    let target = path.join(root, decodeURI(url.slice(base.length)));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
      await stat(target);
      checked++;
    } catch { failures.push(`${path.relative(root, file)}: missing ${url}`); }
  }
}
for (const required of ["about", "contact", "projects", "projects/sign-language", "projects/vegetation-height", "projects/devpilot-ai", "projects/ticket-classification", "mission", "skills", "research", "experience"]) {
  try { await stat(path.join(root, required, "index.html")); }
  catch { failures.push(`Missing page ${required}`); }
}
for (const file of ["resume.pdf", "technical-project-brief.pdf", "models/asl/classifier.onnx", "models/asl/hand-landmarker.task", "models/asl/runtime/ort.wasm.min.mjs", "models/asl/runtime/ort-wasm-simd-threaded.wasm", "imagery/canopy-delhi.bin", "imagery/canopy-rondonia.bin"]) {
  try { if ((await stat(path.join(root, file))).size === 0) failures.push(`Empty file ${file}`); }
  catch { failures.push(`Missing demo/download file ${file}`); }
}
if (base) {
  const chunks = await Promise.all(files.filter(file => file.endsWith(".js")).map(file => readFile(file, "utf8")));
  if (!chunks.some(text => text.includes(`${base}/_next/`))) failures.push("Client runtime is missing the deployment base path");
  if (!chunks.some(text => text.includes(`\"${base}\"`))) failures.push("Client configuration is missing the deployment base path");
}
if (failures.length) throw new Error(failures.join("\n"));
console.log(`Verified ${htmlFiles.length} HTML pages, ${checked} local links/assets, all project routes and required demo/download files (${base || "root"}).`);
