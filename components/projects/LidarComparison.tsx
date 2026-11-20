"use client";

import { useEffect, useRef, useState } from "react";

type Pair = { lidar: number; predicted: number };

function parsePairs(text: string): Pair[] {
  const [header, ...rows] = text.trim().replace(/^\uFEFF/, "").split(/\r?\n/);
  const columns = header.split(",").map((name) => name.trim().replace(/^"|"$/g, "").toLowerCase());
  const lidarColumn = columns.indexOf("lidar_m");
  const predictionColumn = columns.indexOf("predicted_m");
  if (lidarColumn < 0 || predictionColumn < 0) throw new Error("Use CSV columns named lidar_m and predicted_m.");
  const pairs = rows.flatMap((row, index) => {
    if (!row.trim()) return [];
    const fields = row.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
    const reference = fields[lidarColumn];
    const estimate = fields[predictionColumn];
    const lidar = Number(reference);
    const predicted = Number(estimate);
    if (!reference || !estimate || !Number.isFinite(lidar) || !Number.isFinite(predicted) || Math.max(Math.abs(lidar), Math.abs(predicted)) > 1000) {
      throw new Error(`Row ${index + 2} needs two finite heights in metres, within ±1,000 m.`);
    }
    return [{ lidar, predicted }];
  });
  if (pairs.length < 2) throw new Error("Include at least two matched measurements.");
  return pairs;
}

function summarize(pairs: Pair[]) {
  const mean = pairs.reduce((sum, pair) => sum + pair.lidar, 0) / pairs.length;
  let absolute = 0;
  let squared = 0;
  let variance = 0;
  for (const { lidar, predicted } of pairs) {
    absolute += Math.abs(predicted - lidar);
    squared += (predicted - lidar) ** 2;
    variance += (lidar - mean) ** 2;
  }
  return { mae: absolute / pairs.length, rmse: Math.sqrt(squared / pairs.length), r2: variance > 0 ? 1 - squared / variance : null };
}

export default function LidarComparison() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [message, setMessage] = useState("");
  const [reading, setReading] = useState(false);
  const upload = useRef<HTMLInputElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const metrics = pairs.length ? summarize(pairs) : null;

  async function read(file?: File) {
    if (!file) return;
    setReading(true);
    setMessage("");
    setPairs([]);
    try {
      if (file.size > 2_000_000) throw new Error("Choose a CSV under 2 MB.");
      setPairs(parsePairs(await file.text()));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "This file could not be read.");
    } finally {
      setReading(false);
      if (upload.current) upload.current.value = "";
    }
  }

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context || !pairs.length) return;
    const width = context.canvas.width;
    const height = context.canvas.height;
    const bounds = pairs.reduce(([lo, hi], pair) => [Math.min(lo, pair.lidar, pair.predicted), Math.max(hi, pair.lidar, pair.predicted)], [0, 1]);
    const min = Math.floor(bounds[0]);
    const max = Math.ceil(bounds[1]);
    const x = (value: number) => 54 + (value - min) / (max - min) * (width - 81);
    const y = (value: number) => height - 50 - (value - min) / (max - min) * (height - 78);
    context.fillStyle = "#0a1113";
    context.fillRect(0, 0, width, height);
    context.font = "14px system-ui";
    context.fillStyle = "#bdcbc5";
    context.strokeStyle = "#4e6860";
    context.textAlign = "center";
    for (let i = 0; i <= 4; i++) {
      const value = min + i * (max - min) / 4;
      context.beginPath();
      context.moveTo(x(min), y(value));
      context.lineTo(x(max), y(value));
      context.stroke();
      context.fillText(value.toFixed(1), 29, y(value) + 5);
      context.fillText(value.toFixed(1), x(value), height - 28);
    }
    context.fillText("LiDAR height (m)", width / 2, height - 7);
    context.textAlign = "left";
    context.fillText("Predicted height (m)", 54, 17);
    context.setLineDash([5, 5]);
    context.beginPath();
    context.moveTo(x(min), y(min));
    context.lineTo(x(max), y(max));
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = "#b2edcb9b";
    for (const pair of pairs) {
      context.beginPath();
      context.arc(x(pair.lidar), y(pair.predicted), 2.4, 0, Math.PI * 2);
      context.fill();
    }
  }, [pairs]);

  return (
    <section className="rounded-xl border border-white/15 bg-[#101a1d] p-5 md:p-7" aria-labelledby="lidar-comparison-heading">
      <h3 id="lidar-comparison-heading" className="font-display text-xl font-semibold">Compare predictions with LiDAR</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#b4c4bf]">Choose a two-column CSV with <code>lidar_m</code> and <code>predicted_m</code>. Use one row per matched site or pixel. The calculator reads the file in your browser.</p>
      <label className="mt-4 grid gap-2 text-sm text-[#dce9e2]">Paired height measurements
        <input ref={upload} type="file" accept=".csv,text/csv" disabled={reading} onChange={(event) => void read(event.target.files?.[0])} className="focus-ring max-w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#b2edcb] file:px-3 file:py-2 file:font-semibold file:text-[#0a1113]" />
      </label>
      {reading && <p role="status" className="mt-4 text-sm">Reading height pairs…</p>}
      {message && <p role="alert" className="mt-4 text-sm text-[#ffc0b7]">{message}</p>}
      {metrics && (
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-start">
          <dl role="status" className="grid grid-cols-2 gap-4 text-sm">
            {[["Matched pairs", pairs.length], ["MAE", `${metrics.mae.toFixed(2)} m`], ["RMSE", `${metrics.rmse.toFixed(2)} m`], ["R²", metrics.r2?.toFixed(3) ?? "Undefined"]].map(([name, value]) => (
              <div key={name} className="border-t border-white/15 pt-3"><dt className="text-[#b4c4bf]">{name}</dt><dd className="mt-1 font-mono text-xl text-[#b2edcb]">{value}</dd></div>
            ))}
          </dl>
          <canvas ref={canvas} width={570} height={340} className="w-full rounded-lg border border-white/10" role="img" aria-label="Scatter plot of predicted height against LiDAR height. The dashed diagonal indicates equal values." />
        </div>
      )}
    </section>
  );
}
