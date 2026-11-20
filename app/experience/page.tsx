import type { Metadata } from "next";
import { ArrowLink, PageHeader } from "@/components/portfolio/Editorial";
import HorizontalTimeline from "@/components/experience/HorizontalTimeline";

export const metadata: Metadata = { title: "ISRO internship — Dhiren Sharma" };

export default function ExperiencePage() {
  return <div className="ed">
    <div className="ed-wrap"><PageHeader label="Experience · ISRO" title="Research internship">The canopy-height project, from literature review and image preparation to model evaluation.</PageHeader></div>
    <section className="ed-lab" aria-label="Internship timeline"><div className="ed-wrap">
      <HorizontalTimeline />
      <ArrowLink href="/projects/vegetation-height">Read the canopy-height case study</ArrowLink>
    </div></section>
  </div>;
}
