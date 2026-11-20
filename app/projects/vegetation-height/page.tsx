import type { Metadata } from "next";
import { CaseLayout } from "@/components/portfolio/Editorial";
import CanopyHeightExplorer from "@/components/projects/CanopyHeightExplorer";
import EarthObservationLab from "@/components/projects/EarthObservationLab";
import InferencePipeline from "@/components/projects/InferencePipeline";
import LidarComparison from "@/components/projects/LidarComparison";

export const metadata: Metadata = {
  title: "Forest Canopy Height — Dhiren Sharma",
  description: "Canopy-height estimation from satellite imagery and evaluation against LiDAR at ISRO.",
};

export default function VegetationHeightPage() {
  return (
    <CaseLayout
      kind="earth"
      title="Mapping forest canopy height"
      label="Earth observation · ISRO / National Remote Sensing Centre"
      summary="Satellite imagery can reveal where forests grow. At ISRO, I used it to estimate how tall those forests are."
      role="As a machine learning engineering intern, I prepared satellite imagery for training and inference, generated canopy-height estimates, and compared predictions against airborne LiDAR."
      method="I used Rasterio and GDAL to prepare 2,048 × 2,048 image patches, then used DINOv2, DPT and CNN models to generate dense height estimates."
      evaluation="I evaluated the model against LiDAR reference data. The figures below summarize the original project at 25 m scale."
      metrics={[
        { label: "Mean absolute error", value: "1.49 m" },
        { label: "Root mean squared error", value: "3.28 m" },
        { label: "R² at 25 m scale", value: "0.86" },
      ]}
      limitation="The reported accuracy describes the original validation. Differences in forest type, imagery and ground coverage can affect transfer. The interactive map uses public Sentinel-2 imagery and ETH’s canopy-height and uncertainty layers. The LiDAR tool computes validation metrics from the CSV you supply."
    >
      <CanopyHeightExplorer />
      <LidarComparison />
      <EarthObservationLab />
      <section className="ed-pipeline"><h3>From imagery to height estimates</h3><InferencePipeline /></section>
    </CaseLayout>
  );
}
