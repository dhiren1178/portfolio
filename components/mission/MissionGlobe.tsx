"use client";

import dynamic from "next/dynamic";
import { Component, useState, type ReactNode } from "react";
import { FiGlobe } from "react-icons/fi";

const fallback = <p className="p-5 text-sm text-[#bdccc6]">The 3D view requires WebGL. The ground track above is available on this device.</p>;

const EarthCanvas = dynamic(() => import("@/components/hero/EarthCanvas"), {
  ssr: false,
  loading: () => <p role="status" className="p-5 text-sm text-[#bdccc6]">Loading 3D view…</p>,
});

class GlobeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? fallback : this.props.children;
  }
}

export default function MissionGlobe() {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-[#101a1d]" aria-labelledby="mission-globe-title">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-7">
        <div>
          <h2 id="mission-globe-title" className="font-display text-2xl font-semibold">3D Earth and satellite</h2>
          <p className="mt-2 text-sm text-[#bdccc6]">An animated orbit viewed against NASA’s Blue Marble texture.</p>
        </div>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mission-globe-view"
          className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm hover:border-[#b2edcb]"
          onClick={() => setOpen(!open)}
        >
          <FiGlobe aria-hidden="true" /> {open ? "Close 3D view" : "Open 3D view"}
        </button>
      </div>
      <div id="mission-globe-view" hidden={!open}>
        {open && (
          <div className="h-[350px] border-t border-white/10 bg-[#05080c] sm:h-[500px]" role="img" aria-label="Animated three-dimensional Earth and orbiting satellite">
            <GlobeBoundary><EarthCanvas fallback={fallback} /></GlobeBoundary>
          </div>
        )}
      </div>
      <a className="focus-ring mx-5 mb-5 inline-block text-xs text-[#b2edcb] hover:underline md:mx-7" href="https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/" target="_blank" rel="noreferrer">Blue Marble imagery · NASA Goddard Space Flight Center</a>
    </section>
  );
}
