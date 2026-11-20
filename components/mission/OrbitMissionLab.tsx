"use client";
import { useEffect, useMemo, useState } from "react";
import { publicAsset } from "@/lib/publicAsset";

type Mission = { id: string; name: string; inclination: number; altitude: number; period: number; color: string; purpose: string };
const missions: Mission[] = [
  { id: "polar", name: "Polar observation", inclination: 98, altitude: 705, period: 99, color: "#7dd3fc", purpose: "High-latitude Earth observation concept" },
  { id: "mid", name: "Regional imaging", inclination: 52, altitude: 550, period: 95, color: "#86efac", purpose: "Mid-inclination imaging concept" },
  { id: "equatorial", name: "Equatorial survey", inclination: 8, altitude: 620, period: 97, color: "#fcd34d", purpose: "Low-inclination coverage concept" },
];
const DEG = Math.PI / 180;
function orbitPosition(progress: number, inclination: number) {
  const angle = progress * Math.PI * 2;
  const lat = Math.asin(Math.sin(inclination * DEG) * Math.sin(angle)) / DEG;
  const lon = ((progress * 360 * 1.12 + 180) % 360) - 180;
  return { x: (lon + 180) / 360 * 900, y: (90 - lat) / 180 * 450, lat, lon };
}
export default function OrbitMissionLab() {
  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0.12);
  const [playing, setPlaying] = useState(false);
  const [tracks, setTracks] = useState(true);
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let previous = 0;
    const tick = (time: number) => {
      if (previous) setProgress(p => (p + Math.min((time - previous) / 65000, 0.015)) % 1);
      previous = time;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  const mission = missions[selected];
  const point = orbitPosition(progress, mission.inclination);
  const segments = useMemo(() => {
    const paths: string[] = [];
    let current = "";
    let prevX = -1;
    for (let i = 0; i <= 400; i++) {
      const p = orbitPosition(i / 400, mission.inclination);
      if (prevX >= 0 && p.x < prevX - 400) { paths.push(current); current = ""; }
      current += `${current ? " L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      prevX = p.x;
    }
    paths.push(current);
    return paths;
  }, [mission.inclination]);
  return <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#08131b]" aria-label="Interactive satellite mission simulator">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-6 md:p-8"><div><p className="font-mono text-xs tracking-[.2em] text-teal-300">ORBITAL OPERATIONS / INTERACTIVE SIMULATION</p><h2 className="mt-3 text-2xl font-semibold md:text-3xl">Earth observation mission tracker</h2></div><span className="rounded-full border border-amber-300/30 px-3 py-1.5 font-mono text-xs text-amber-200">SIMULATED ORBITS</span></div>
    <div className="grid lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
      <div className="relative min-h-[310px] bg-[#071a22] p-3 md:p-6"><svg viewBox="0 0 900 450" role="img" aria-label={`Illustrative ground track for ${mission.name}, satellite at latitude ${point.lat.toFixed(1)} degrees`} className="h-full w-full rounded-xl border border-white/10 bg-[#091d29]">
        <defs><pattern id="grid" width="75" height="75" patternUnits="userSpaceOnUse"><path d="M75 0H0V75" fill="none" stroke="#8fb2b5" strokeOpacity=".13" strokeWidth="1"/></pattern><filter id="satGlow"><feGaussianBlur stdDeviation="5"/></filter></defs>
        <image href={publicAsset("/imagery/blue-marble.webp")} width="900" height="450" />
        <rect width="900" height="450" fill="#06121b" opacity=".38" />
        <rect width="900" height="450" fill="url(#grid)"/>{tracks && segments.map((d,i)=><path key={i} d={d} fill="none" stroke={mission.color} strokeWidth="2" strokeOpacity=".75" strokeDasharray="8 6"/>)}
        <circle cx={point.x} cy={point.y} r="20" fill={mission.color} opacity=".25" filter="url(#satGlow)"/><circle cx={point.x} cy={point.y} r="8" fill={mission.color}/><circle cx={point.x} cy={point.y} r="14" fill="none" stroke={mission.color} strokeOpacity=".8" strokeWidth="1.5"/><path d={`M${point.x-19} ${point.y}h-9M${point.x+19} ${point.y}h9M${point.x} ${point.y-19}v-9M${point.x} ${point.y+19}v9`} stroke={mission.color} strokeWidth="1.5"/>
        <text x="18" y="28" fontSize="12" fill="#b4d9d8" fontFamily="monospace">GROUND TRACK / ILLUSTRATIVE</text><text x="18" y="430" fontSize="12" fill="#8ca8ad" fontFamily="monospace">SIMULATED POSITION</text>
      </svg><div className="mt-4 flex flex-wrap items-center gap-3"><button onClick={()=>setPlaying(v=>!v)} className="rounded-full bg-teal-300 px-5 py-2 text-sm font-semibold text-black">{playing?"Pause simulation":"Play simulation"}</button><button onClick={()=>setProgress(0)} className="rounded-full border border-white/20 px-4 py-2 text-sm">Reset</button><label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={tracks} onChange={e=>setTracks(e.target.checked)} className="accent-teal-300"/>Ground track</label></div></div>
      <div className="border-t border-white/10 p-6 lg:border-l lg:border-t-0 md:p-8"><p className="mb-3 font-mono text-xs tracking-widest text-white/50">MISSION PROFILE</p><div className="grid gap-2">{missions.map((m,i)=><button key={m.id} onClick={()=>{setSelected(i);setProgress(0.12)}} aria-pressed={i===selected} className={`rounded-xl border p-4 text-left transition-colors ${i===selected?"border-teal-300/70 bg-teal-300/10":"border-white/10 hover:border-white/40"}`}><span className="block font-medium">{m.name}</span><span className="mt-1 block text-xs text-white/50">{m.purpose}</span></button>)}</div><div className="mt-8 grid grid-cols-2 gap-5">{[["Altitude",`${mission.altitude} km`],["Inclination",`${mission.inclination}°`],["Orbit period",`${mission.period} min`],["Latitude",`${point.lat.toFixed(1)}°`],["Longitude",`${point.lon.toFixed(1)}°`],["Simulation",playing?"Running":"Paused"]].map(([label,value])=><div key={label} className="border-t border-white/15 pt-3"><p className="text-xs text-white/50">{label}</p><p className="mt-1 font-mono text-lg">{value}</p></div>)}</div><p className="mt-6 text-xs leading-relaxed text-white/45">Educational orbit visualization using simplified geometry. Positions, altitude and periods are illustrative presets, not NORAD/TLE-derived predictions.</p></div>
    </div>
  </section>;
}
