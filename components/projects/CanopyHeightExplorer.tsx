"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { publicAsset } from "@/lib/publicAsset";
import { FiArrowUpRight, FiCrosshair } from "react-icons/fi";

const size = 256;
const noData = 255;
const pixelDegrees = 1 / 12000;
const palette = [
  [35, 70, 73],
  [24, 126, 118],
  [92, 172, 102],
  [228, 203, 97],
  [255, 230, 164],
];
const legend = "linear-gradient(to right, #234649, #187e76, #5cac66, #e4cb61, #ffe6a4)";
const uncertaintyPalette = [[44, 34, 74], [89, 67, 143], [151, 91, 173], [221, 139, 128], [255, 226, 150]];
const uncertaintyLegend = "linear-gradient(to right, #2c224a, #59438f, #975bad, #dd8b80, #ffe296)";

const samples = {
  delhi: { name: "Delhi Ridge, India", row: 2600, column: 12054, date: "14 February 2020" },
  rondonia: { name: "Rondônia, Brazil", row: 4416, column: 5445, date: "23 August 2020" },
};
type SampleId = keyof typeof samples;

type Raster = {
  values: Uint8Array;
  mean: number;
  percentile90: number;
  valid: number;
};

type Point = { x: number; y: number };
const center = { x: size / 2, y: size / 2 };

function clampPixel(pixel: number) {
  return Math.max(0, Math.min(size - 1, pixel));
}

function readRaster(values: Uint8Array): Raster {
  if (values.length !== size * size) throw new Error("Unexpected raster dimensions");
  const counts = new Uint32Array(noData);
  let total = 0;
  let valid = 0;
  for (const value of values) {
    if (value === noData) continue;
    total += value;
    valid++;
    counts[value]++;
  }
  if (!valid) throw new Error("No valid raster pixels");
  let cumulative = 0;
  const percentile90 = counts.findIndex((count) => {
    cumulative += count;
    return cumulative >= valid * 0.9;
  });
  return { values, mean: total / valid, percentile90, valid };
}

function renderRaster(canvas: HTMLCanvasElement, values: Uint8Array, colors: number[][], maximum: number) {
  const context = canvas.getContext("2d");
  if (!context) return;
  const image = context.createImageData(size, size);
  for (let pixel = 0; pixel < values.length; pixel++) {
    const height = values[pixel];
    const offset = pixel * 4;
    if (height === noData) {
      const gray = ((pixel % size + Math.floor(pixel / size)) % 8 < 3) ? 28 : 18;
      image.data.set([gray, gray, gray, 255], offset);
      continue;
    }
    const progress = Math.min(height / maximum, 1) * (colors.length - 1);
    const index = Math.min(Math.floor(progress), colors.length - 2);
    const base = colors[index];
    const next = colors[index + 1];
    for (let channel = 0; channel < 3; channel++) {
      image.data[offset + channel] = base[channel] + (next[channel] - base[channel]) * (progress - index);
    }
    image.data[offset + 3] = 255;
  }
  context.putImageData(image, 0, 0);
}

export default function CanopyHeightExplorer() {
  const [sample, setSample] = useState<SampleId>("delhi");
  const [layer, setLayer] = useState<"imagery" | "height" | "uncertainty">("height");
  const [scan, setScan] = useState(0);
  const [point, setPoint] = useState<Point>(center);
  const [raster, setRaster] = useState<Raster | null>(null);
  const [uncertainty, setUncertainty] = useState<Uint8Array | null>(null);
  const [error, setError] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const site = samples[sample];
  const pixel = point.y * size + point.x;
  const height = raster?.values[pixel];
  const deviation = uncertainty?.[pixel];
  const longitude = -180 + (site.column * size + point.x + 0.5) * pixelDegrees;
  const latitude = 84 - (site.row * size + point.y + 0.5) * pixelDegrees;

  useEffect(() => {
    const controller = new AbortController();
    function load(suffix: string) {
      return fetch(publicAsset(`/imagery/canopy-${sample}${suffix}.bin`), { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error("Could not load raster");
        return response.arrayBuffer();
      }).then((buffer) => new Uint8Array(buffer));
    }
    Promise.all([load(""), load("-sd")])
      .then(([heights, deviations]) => {
        if (controller.signal.aborted) return;
        if (deviations.length !== size * size) throw new Error("Unexpected uncertainty dimensions");
        setRaster(readRaster(heights));
        setUncertainty(deviations);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [sample]);

  useEffect(() => {
    const values = layer === "height" ? raster?.values : uncertainty;
    if (values && canvas.current) renderRaster(canvas.current, values, layer === "height" ? palette : uncertaintyPalette, layer === "height" ? 30 : 16);
  }, [layer, raster, uncertainty]);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/15 bg-[#101a1d]" aria-labelledby="height-explorer-title">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-7">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#b2edcb]">Public data / ETH Global Canopy Height 2020</p>
          <h2 id="height-explorer-title" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Inspect canopy height</h2>
        </div>
        <div role="group" aria-label="Canopy sample" className="portfolio-switch">
          {(Object.keys(samples) as SampleId[]).map((key) => (
            <button type="button" key={key} aria-pressed={sample === key} className="focus-ring" onClick={() => {
              if (sample === key) return;
              setRaster(null);
              setUncertainty(null);
              setError(false);
              setPoint(center);
              setSample(key);
              setScan((value) => value + 1);
            }}>
              {key === "delhi" ? "Delhi Ridge" : "Rondônia"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 px-5 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:px-7">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Map layer">
            {([["imagery", "Satellite image"], ["height", "Height"], ["uncertainty", "Uncertainty"]] as const).map(([id, name]) => (
              <button key={id} type="button" aria-pressed={layer === id} onClick={() => setLayer(id)} className="focus-ring min-h-10 rounded-md border border-white/20 px-3 text-xs text-[#d7e3dc] aria-pressed:border-[#b2edcb] aria-pressed:bg-[#214237]">{name}</button>
            ))}
          </div>
          <div
            tabIndex={0}
            role="group"
            aria-label={`${layer === "imagery" ? "Satellite image" : layer === "height" ? "Canopy height" : "Model uncertainty"} map for ${site.name}`}
            aria-describedby="canopy-map-help canopy-map-value"
            className="focus-ring relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#0a1113] touch-pan-y"
            onPointerMove={(event) => {
              if (event.pointerType !== "mouse" || !raster) return;
              const area = event.currentTarget.getBoundingClientRect();
              setPoint({
                x: clampPixel(Math.floor((event.clientX - area.left) / area.width * size)),
                y: clampPixel(Math.floor((event.clientY - area.top) / area.height * size)),
              });
            }}
            onClick={(event) => {
              if (!raster || event.detail === 0) return;
              const area = event.currentTarget.getBoundingClientRect();
              setPoint({
                x: clampPixel(Math.floor((event.clientX - area.left) / area.width * size)),
                y: clampPixel(Math.floor((event.clientY - area.top) / area.height * size)),
              });
              setScan((value) => value + 1);
            }}
            onKeyDown={(event) => {
              const offsets: Record<string, Point> = {
                ArrowLeft: { x: -1, y: 0 },
                ArrowRight: { x: 1, y: 0 },
                ArrowUp: { x: 0, y: -1 },
                ArrowDown: { x: 0, y: 1 },
              };
              const offset = offsets[event.key];
              if (!raster || !offset) return;
              event.preventDefault();
              setPoint(({ x, y }) => ({ x: clampPixel(x + offset.x), y: clampPixel(y + offset.y) }));
            }}
          >
            {raster ? (
              <>
                {layer === "imagery" ? (
                  <Image src={publicAsset(`/imagery/canopy-${sample}-rgb.webp`)} alt={`Sentinel-2 true color image of ${site.name}`} fill unoptimized className="object-fill" />
                ) : (
                  <canvas ref={canvas} width={size} height={size} className="absolute inset-0 h-full w-full [image-rendering:pixelated]" aria-hidden="true" />
                )}
                {scan > 0 && <div key={scan} className="canopy-sweep pointer-events-none absolute inset-x-0 h-px bg-[#a9ffd0] motion-reduce:hidden" style={{ "--scan-line": `${(point.y + 0.5) / size * 100}%` } as CSSProperties} aria-hidden="true" />}
                <FiCrosshair
                  aria-hidden="true"
                  className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_1px_2px_#000]"
                  style={{ left: `${(point.x + 0.5) / size * 100}%`, top: `${(point.y + 0.5) / size * 100}%` }}
                />
              </>
            ) : (
              <p role="status" className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-[#c1d0ca]">
                {error ? "This canopy sample could not be loaded." : "Loading canopy measurements…"}
              </p>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p id="canopy-map-help" className="text-xs leading-relaxed text-[#b4c4bf]">Hover, tap or use the arrow keys with the map focused to inspect a pixel.</p>
            <button type="button" disabled={!raster} className="focus-ring rounded-md border border-white/20 px-3 py-2 text-xs text-[#d7e3dc] disabled:opacity-40" onClick={() => setScan((value) => value + 1)}>Animate scan</button>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold">{site.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#b4c4bf]">Estimated top-of-canopy height near 10 m resolution. The plot spans roughly 2 km and represents one sample tile.</p>

          {layer === "imagery" ? <p className="mt-5 text-sm text-[#b4c4bf]">Sentinel-2 true color · {site.date}</p> : (
            <div className="mt-5">
              <div className="h-2 rounded-full" style={{ background: layer === "height" ? legend : uncertaintyLegend }} />
              <div className="mt-1 flex justify-between font-mono text-xs text-[#bdccc6]"><span>0 m</span><span>{layer === "height" ? "15 m" : "8 m"}</span><span>{layer === "height" ? "30 m+" : "16 m+"}</span></div>
              <p className="mt-2 text-xs text-[#b4c4bf]">{layer === "uncertainty" ? "Predictive standard deviation in metres. " : ""}Hatched areas have no data.</p>
            </div>
          )}

          <p id="canopy-map-value" className="mt-6 rounded-md border border-white/15 bg-[#0a1113] p-3 font-mono text-xs leading-relaxed" aria-live="off">
            <span className="block text-[#b2edcb]">{height === undefined ? "Height unavailable" : height === noData ? "No data in this pixel" : `Estimated height: ${height} m`}</span>
            {deviation !== undefined && deviation !== noData && <span className="mt-1 block text-[#bdccc6]">Predictive standard deviation · {deviation} m</span>}
            {raster && <span className="mt-1 block text-[#bdccc6]">{latitude.toFixed(5)}°, {longitude.toFixed(5)}°</span>}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="border-t border-white/15 pt-3">
              <dt className="text-xs text-[#bdccc6]">Mean height</dt>
              <dd className="mt-1 font-mono text-lg">{raster ? `${raster.mean.toFixed(1)} m` : "—"}</dd>
            </div>
            <div className="border-t border-white/15 pt-3">
              <dt className="text-xs text-[#bdccc6]">90th percentile</dt>
              <dd className="mt-1 font-mono text-lg">{raster ? `${raster.percentile90} m` : "—"}</dd>
            </div>
          </dl>
          {raster && <p className="mt-2 text-xs text-[#b4c4bf]">Statistics use {raster.valid.toLocaleString("en-US")} valid pixels in this tile.</p>}

          <p className="mt-5 text-xs leading-relaxed text-[#b4c4bf]">
            Lang et al. (2023). The ETH team generated these estimates from Sentinel-2 imagery and GEDI LiDAR. The image layer contains modified Copernicus Sentinel data (2020).
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#b2edcb]">
            <a className="focus-ring inline-flex items-center gap-1 hover:underline" href="https://doi.org/10.3929/ethz-b-000609802" target="_blank" rel="noreferrer">Dataset <FiArrowUpRight aria-hidden="true" /></a>
            <a className="focus-ring inline-flex items-center gap-1 hover:underline" href="https://doi.org/10.1038/s41559-023-02206-6" target="_blank" rel="noreferrer">Paper <FiArrowUpRight aria-hidden="true" /></a>
            <a className="focus-ring inline-flex items-center gap-1 hover:underline" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0 <FiArrowUpRight aria-hidden="true" /></a>
            <a className="focus-ring inline-flex items-center gap-1 hover:underline" href="https://registry.opendata.aws/sentinel-2-l2a-cogs/" target="_blank" rel="noreferrer">Sentinel-2 imagery <FiArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
