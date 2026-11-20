import ResearchNotebook from "@/components/research/ResearchNotebook";
import { ArrowLink, PageHeader } from "@/components/portfolio/Editorial";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Research — Dhiren Sharma" };

export default function ResearchPage() {
  return <div className="ed">
    <div className="ed-wrap">
      <PageHeader title="Research notes">Methods, results and limitations from my work in remote sensing and applied machine learning.</PageHeader>
      <section className="ed-section ed-split ed-research-focus">
        <h2>Current interests</h2>
        <div><h3>Efficient test-time adaptation</h3>
          <p>At FAU, I’m exploring token condensation for CLIP and how it affects accuracy on new data.</p>
          <h3>Forest structure from orbit</h3>
          <p>I’m interested in what satellite imagery can reveal about canopy structure and how to validate those estimates against independent measurements.</p>
          <ArrowLink href="/projects/vegetation-height">Read the canopy-height study</ArrowLink>
        </div>
      </section>
    </div>
    <section className="ed-lab" aria-label="Project notebook"><div className="ed-wrap">
      <ResearchNotebook />
      <ArrowLink href="/mission">Open the orbital mission simulator</ArrowLink>
    </div></section>
  </div>;
}
