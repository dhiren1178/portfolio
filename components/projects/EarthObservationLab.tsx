"use client";

import Image from "next/image";
import { publicAsset } from "@/lib/publicAsset";
import { useState, type PointerEvent } from "react";
import { FiArrowUpRight, FiMinus, FiPlus, FiRefreshCw } from "react-icons/fi";

const scenes = {
  "2000": { date: "30 Jul 2000", path: "/imagery/rondonia-2000.webp" },
  "2006": { date: "17 Jul 2006", path: "/imagery/rondonia-2006.webp" },
  "2012": { date: "18 Jul 2012", path: "/imagery/rondonia-2012.webp" },
} as const;

type Year = keyof typeof scenes;
const years = Object.keys(scenes) as Year[];
const nasaSource = "https://science.nasa.gov/earth/earth-observatory/world-of-change/amazon-deforestation/";

export default function EarthObservationLab() {
  const [earlier, setEarlier] = useState<Year>("2000");
  const [later, setLater] = useState<Year>("2012");
  const [split, setSplit] = useState(50);
  const [zoom, setZoom] = useState(1);

  function moveDivider(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = ((event.clientX - bounds.left) / bounds.width) * 100;
    setSplit(Math.round(Math.max(0, Math.min(100, position))));
  }

  function reset() {
    setEarlier("2000");
    setLater("2012");
    setSplit(50);
    setZoom(1);
  }

  return (
    <section aria-labelledby="earth-observation-heading" className="overflow-hidden rounded-2xl border border-white/15 bg-[#101a1d]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 px-5 py-5 md:px-7">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#b2edcb]">NASA Terra / MODIS</p>
          <h2 id="earth-observation-heading" className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Rondônia, Brazil</h2>
        </div>
        <a href={nasaSource} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 text-sm text-[#b2edcb] hover:underline">
          NASA image series <FiArrowUpRight aria-hidden="true" />
        </a>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          <div
            className="relative aspect-[3/2] touch-pan-y select-none overflow-hidden bg-[#1c382b] hover:cursor-ew-resize"
            onPointerDown={(event) => {
              if (!event.isPrimary || event.button !== 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              moveDivider(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) moveDivider(event);
            }}
          >
            <Image
              src={publicAsset(scenes[later].path)}
              alt={`Satellite image of Rondônia from ${scenes[later].date}`}
              fill
              sizes="(min-width: 1024px) 760px, 100vw"
              className="pointer-events-none object-fill"
              style={{ transform: `scale(${zoom})` }}
              draggable={false}
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
              <Image
                src={publicAsset(scenes[earlier].path)}
                alt={`Satellite image of Rondônia from ${scenes[earlier].date}`}
                fill
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-fill"
                style={{ transform: `scale(${zoom})` }}
                draggable={false}
                unoptimized
              />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_#000]" style={{ left: `${split}%` }}>
              <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black">↔</span>
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 font-mono text-[10px] sm:p-4 sm:text-xs">
              <span className="rounded bg-black/80 px-2 py-1.5">{scenes[earlier].date}</span>
              <span className="rounded bg-black/80 px-2 py-1.5">{scenes[later].date}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 border-t border-white/10 px-5 py-4">
            <label htmlFor="scene-divider" className="text-sm text-[#d5e0dd]">Wipe position</label>
            <input
              id="scene-divider"
              aria-valuetext={`${split}% ${earlier} imagery`}
              type="range"
              min={0}
              max={100}
              value={split}
              onChange={(event) => setSplit(Number(event.target.value))}
              className="focus-ring min-w-0 flex-1 accent-[#b2edcb]"
            />
            <output htmlFor="scene-divider" aria-hidden="true" className="w-10 text-right font-mono text-xs tabular-nums text-[#b2edcb]">{split}%</output>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/10 px-5 py-5 lg:border-l lg:border-t-0 lg:px-6">
          <label className="grid gap-2 text-xs uppercase tracking-wide text-[#c2d0cc]">
            Left image
            <select value={earlier} onChange={(event) => setEarlier(event.target.value as Year)} className="focus-ring rounded-md border border-white/20 bg-[#0a1113] p-2.5 text-sm text-white">
              {years.filter((year) => year < later).map((year) => <option key={year} value={year}>{scenes[year].date}</option>)}
            </select>
          </label>

          <label className="grid gap-2 text-xs uppercase tracking-wide text-[#c2d0cc]">
            Right image
            <select value={later} onChange={(event) => setLater(event.target.value as Year)} className="focus-ring rounded-md border border-white/20 bg-[#0a1113] p-2.5 text-sm text-white">
              {years.filter((year) => year > earlier).map((year) => <option key={year} value={year}>{scenes[year].date}</option>)}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button type="button" className="focus-ring rounded border border-white/20 p-2 disabled:opacity-35" aria-label="Zoom out" disabled={zoom === 1} onClick={() => setZoom((current) => current - 0.5)}><FiMinus aria-hidden="true" /></button>
            <output aria-label="Zoom level" className="w-9 text-center font-mono">{zoom}×</output>
            <button type="button" className="focus-ring rounded border border-white/20 p-2 disabled:opacity-35" aria-label="Zoom in" disabled={zoom === 2.5} onClick={() => setZoom((current) => current + 0.5)}><FiPlus aria-hidden="true" /></button>
            <button type="button" className="focus-ring ml-auto rounded border border-white/20 p-2" aria-label="Reset comparison" onClick={reset}><FiRefreshCw aria-hidden="true" /></button>
          </div>
          <p className="border-t border-white/10 pt-4 text-sm leading-relaxed text-[#b4c4bf]">
            Slide across the images to follow the light green and tan clearings as they spread from roads into dark green forest. These archive scenes show land-cover change. The ISRO canopy-height research below used a separate dataset.
          </p>
        </div>
      </div>
    </section>
  );
}
