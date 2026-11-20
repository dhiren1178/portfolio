import { copyFile, mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const target = new URL("public/models/asl/runtime/", root);
await mkdir(target, { recursive: true });

const files = [
  ...["vision_wasm_internal", "vision_wasm_nosimd_internal"].flatMap((base) =>
    ["js", "wasm"].map((ext) => ["@mediapipe/tasks-vision/wasm", `${base}.${ext}`]),
  ),
  ...["mjs", "wasm"].map((ext) => ["onnxruntime-web/dist", `ort-wasm-simd-threaded.${ext}`]),
  ["onnxruntime-web/dist", "ort.wasm.min.mjs"],
];

await Promise.all(files.map(([directory, file]) =>
  copyFile(new URL(`node_modules/${directory}/${file}`, root), new URL(file, target)),
));
