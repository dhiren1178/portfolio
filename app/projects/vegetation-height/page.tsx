"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import VegetationMap from "@/components/projects/VegetationMap";
import StatsPanel from "@/components/projects/StatsPanel";
import InferencePipeline from "@/components/projects/InferencePipeline";
import BeforeAfterSlider from "@/components/projects/BeforeAfterSlider";
import type { VegetationRegion } from "@/lib/vegetationData";

export default function VegetationHeightPage() {
  const [selected, setSelected] = useState<VegetationRegion | null>(null);

  return (
    <div className="relative min-h-screen bg-void px-6 pt-32 pb-24 md:px-16">
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Project 01 — Geospatial AI"
          title="Vegetation Height Estimation"
          description="A Vision Transformer reads high-resolution satellite imagery and predicts canopy height, density, and biomass per region — turning a flat satellite tile into a measurable forest profile."
        />

        {/* Interactive map + live stats */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <VegetationMap selectedId={selected?.id ?? null} onSelect={setSelected} />
          <StatsPanel region={selected} />
        </div>
        <p className="mt-3 text-xs text-phosphor-faint">
          Click a region marker, or one of the chips below the map, to run the model.
        </p>

        {/* Inference pipeline */}
        <div className="mt-20">
          <SectionHeading eyebrow="How it works" title="Inference pipeline" />
          <div className="mt-8">
            <InferencePipeline />
          </div>
        </div>

        {/* Before / after */}
        <div className="mt-20">
          <SectionHeading
            eyebrow="Comparison"
            title="Raw tile vs. predicted height map"
          />
          <div className="mt-8">
            <BeforeAfterSlider />
          </div>
        </div>

        {/* Model explanation */}
        <div className="mt-20 max-w-2xl">
          <SectionHeading eyebrow="About the model" title="What's under the hood" />
          <p className="mt-4 text-phosphor-dim leading-relaxed">
            The model is built on a <span className="text-phosphor">DINOv2</span> Vision
            Transformer backbone, fine-tuned as a dense regression head over
            multi-band imagery from <span className="text-phosphor">Sentinel-2</span> and{" "}
            <span className="text-phosphor">Cartosat</span>. Rather than
            classifying land cover, it predicts a continuous per-pixel canopy
            height value, which is then aggregated per region into the
            summary statistics shown above.
          </p>
        </div>
      </div>
    </div>
  );
}
