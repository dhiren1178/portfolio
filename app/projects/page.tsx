import type { Metadata } from "next";
import { PageHeader, WorkList } from "@/components/portfolio/Editorial";

export const metadata: Metadata = { title: "Work — Dhiren Sharma" };

export default function ProjectsPage() {
  return <div className="ed"><div className="ed-wrap">
    <PageHeader title="Selected work">Case studies in Earth observation, agentic AI, computer vision and production machine learning.</PageHeader>
    <section aria-label="Project case studies"><h2 className="sr-only">Case studies</h2><WorkList includeEarth /></section>
  </div></div>;
}
