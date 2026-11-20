import type { Metadata } from "next";
import { ArrowLink, PageHeader } from "@/components/portfolio/Editorial";
import MissionGlobe from "@/components/mission/MissionGlobe";
import OrbitMissionLab from "@/components/mission/OrbitMissionLab";

export const metadata: Metadata = { title: "Mission Lab — Dhiren Sharma" };

export default function MissionPage() {
  return <div className="ed">
    <div className="ed-wrap"><PageHeader label="Earth observation" title="Orbital mission simulator">Compare simulated imaging orbits, ground tracks and spacecraft positions.</PageHeader></div>
    <section className="ed-lab" aria-label="Orbit simulation"><div className="ed-wrap">
      <OrbitMissionLab />
      <MissionGlobe />
      <ArrowLink href="/projects/vegetation-height">Explore the canopy-height case study</ArrowLink>
    </div></section>
  </div>;
}
