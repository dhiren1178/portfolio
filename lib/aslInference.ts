import type { HandLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { InferenceSession } from "onnxruntime-web/wasm";

import { publicAsset } from "@/lib/publicAsset";

const assets = publicAsset("/models/asl");
export const inputSize = 96;
const drawSize = 192;
export const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const sampleLetters = ["B", "L", "Y"] as const;
export type SampleLetter = (typeof sampleLetters)[number];
export type Score = { letter: string; probability: number };

// Canvas adaptation of Nicolás Florentín's preprocessing.py. See the adjacent
// classifier license in public/models/asl and the source in PHASE15_NOTES.md.
const palm = [[0, 1], [0, 5], [0, 17], [5, 9], [9, 13], [13, 17]];
const fingers = [
  { points: [1, 2, 3, 4], color: "#ffe5b4" },
  { points: [5, 6, 7, 8], color: "#804080" },
  { points: [9, 10, 11, 12], color: "#ffcc00" },
  { points: [13, 14, 15, 16], color: "#30ff30" },
  { points: [17, 18, 19, 20], color: "#1565c0" },
];
const bones = [
  ...palm.map(([from, to]) => ({ from, to, color: "#808080" })),
  ...fingers.flatMap(({ points, color }) =>
    points.slice(1).map((to, i) => ({ from: points[i], to, color })),
  ),
];

type Point = { x: number; y: number };

function trace(context: CanvasRenderingContext2D, points: Point[], overlay: boolean) {
  context.lineWidth = overlay ? Math.max(2, context.canvas.width / 300) : 1;
  context.lineCap = "round";
  for (const { from, to, color } of bones) {
    context.beginPath();
    context.strokeStyle = overlay ? "#8df2bd" : color;
    context.moveTo(points[from].x, points[from].y);
    context.lineTo(points[to].x, points[to].y);
    context.stroke();
  }
  const radius = overlay ? Math.max(3, context.canvas.width / 170) : 2;
  points.forEach(({ x, y }, index) => {
    context.fillStyle = overlay ? "#e2ffea" : "#e0e0e0";
    context.beginPath();
    context.arc(x, y, radius + 1, 0, 2 * Math.PI);
    context.fill();
    if (overlay) return;
    const finger = fingers.find(({ points }) => points.slice(1).includes(index));
    context.fillStyle = finger?.color ?? "#ff3030";
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
  });
}

export function drawLiveFrame(context: CanvasRenderingContext2D, video: HTMLVideoElement, landmarks?: NormalizedLandmark[]) {
  const { canvas } = context;
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  context.save();
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.restore();
  if (!landmarks) return;
  trace(context, landmarks.map(({ x, y }) => ({ x: (1 - x) * canvas.width, y: y * canvas.height })), true);
}

function contextAt(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is unavailable");
  return context;
}

export function sampleImage(letter: SampleLetter) {
  const image = new Image();
  image.src = `${assets}/examples/${letter}.png`;
  return image;
}

export async function loadClassifier() {
  const runtime = `${assets}/runtime/ort.wasm.min.mjs`;
  const ort = await import(/* webpackIgnore: true */ runtime) as typeof import("onnxruntime-web/wasm");
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.wasmPaths = `${location.origin}${assets}/runtime/`;
  const skeleton = contextAt(drawSize);
  const input = contextAt(inputSize);
  const session: InferenceSession = await ort.InferenceSession.create(`${assets}/classifier.onnx`, {
    executionProviders: ["wasm"],
  });

  async function predict() {
    const rgba = input.getImageData(0, 0, inputSize, inputSize).data;
    const rgb = new Float32Array(inputSize * inputSize * 3);
    for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
      rgb[j] = rgba[i];
      rgb[j + 1] = rgba[i + 1];
      rgb[j + 2] = rgba[i + 2];
    }
    const outputName = session.outputNames[0];
    const tensor = new ort.Tensor("float32", rgb, [1, inputSize, inputSize, 3]);
    const results = await session.run({ [session.inputNames[0]]: tensor }, [outputName]);
    const values = Array.from(results[outputName].data as Float32Array);
    const peak = Math.max(...values);
    const scores = values.map((value) => Math.exp(value - peak));
    const sum = scores.reduce((total, score) => total + score, 0);
    return scores.map((score, index) => ({ letter: letters[index], probability: score / sum }))
      .sort((a, b) => b.probability - a.probability).slice(0, 3);
  }

  return {
    predictSample(image: HTMLImageElement) {
      input.drawImage(image, 0, 0, inputSize, inputSize);
      return predict();
    },
    predictHand(landmarks: NormalizedLandmark[], width: number, height: number) {
      const points = landmarks.map(({ x, y }) => ({ x: (1 - x) * width, y: y * height }));
      const xs = points.map(({ x }) => x);
      const ys = points.map(({ y }) => y);
      const left = Math.min(...xs);
      const top = Math.min(...ys);
      const w = Math.max(...xs) - left;
      const h = Math.max(...ys) - top;
      const box = Math.max(w, h, 1) / 0.7;
      skeleton.fillStyle = "#000";
      skeleton.fillRect(0, 0, drawSize, drawSize);
      trace(skeleton, points.map(({ x, y }) => ({
        x: Math.round(((x - left - w / 2) / box + 0.5) * drawSize),
        y: Math.round(((y - top - h / 2) / box + 0.5) * drawSize),
      })), false);
      input.drawImage(skeleton.canvas, 0, 0, inputSize, inputSize);
      return predict();
    },
    release: () => session.release(),
  };
}

export async function loadHandTracker(): Promise<HandLandmarker> {
  const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
  const vision = await FilesetResolver.forVisionTasks(`${assets}/runtime`);
  return HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: `${assets}/hand-landmarker.task`, delegate: "CPU" },
    runningMode: "VIDEO",
    numHands: 1,
  });
}

export function supportsHandTracking() {
  const canvas = document.createElement("canvas");
  const graphics = canvas.getContext("webgl2") || canvas.getContext("webgl");
  graphics?.getExtension("WEBGL_lose_context")?.loseContext();
  return !!graphics;
}
