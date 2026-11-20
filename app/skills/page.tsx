import type { Metadata } from "next";
import { PageHeader } from "@/components/portfolio/Editorial";
import SkillsConstellation from "@/components/skills/SkillsConstellation";

export const metadata: Metadata = { title: "Skills — Dhiren Sharma" };

export default function SkillsPage() {
  return <div className="ed">
    <div className="ed-wrap"><PageHeader title="Technical toolkit">Explore how the tools I use for machine learning, geospatial analysis and software engineering fit together.</PageHeader></div>
    <section className="ed-lab" aria-label="Interactive skills map"><div className="ed-wrap"><SkillsConstellation /></div></section>
  </div>;
}
