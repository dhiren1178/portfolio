import type { Metadata } from "next";
import { ArrowLink, PageHeader } from "@/components/portfolio/Editorial";
import { skillGroups, timelineEntries } from "@/lib/aboutData";
import { publicAsset } from "@/lib/publicAsset";

export const metadata: Metadata = { title: "About — Dhiren Sharma" };

export default function AboutPage() {
  return <div className="ed"><div className="ed-wrap">
    <PageHeader label="About" title="Dhiren Sharma">I’m an AI engineer and M.Sc. student at FAU Erlangen–Nürnberg. My work spans remote sensing, computer vision and machine learning in production.</PageHeader>
    <section className="ed-section ed-split">
      <h2>Experience and education</h2>
      <ol className="ed-timeline">{[...timelineEntries].reverse().map((entry) => <li key={entry.id}>
        <p className="ed-kicker">{entry.year}</p>
        <h3>{entry.title}</h3>
        <p><strong>{entry.org}</strong></p>
        <p>{entry.description}</p>
      </li>)}</ol>
    </section>
    <section className="ed-section ed-split"><h2>Toolkit</h2><div className="ed-toolkit">
      {skillGroups.map((group) => <div key={group.label}><h3>{group.label}</h3><p>{group.skills.join(" · ")}</p></div>)}
      <ArrowLink href="/skills">Explore the skills map</ArrowLink>
      <ArrowLink href="/experience">See the ISRO internship timeline</ArrowLink>
    </div></section>
    <a className="ed-link ed-about-resume" href={publicAsset("/resume.pdf")} download>Download résumé ↓</a>
  </div></div>;
}
