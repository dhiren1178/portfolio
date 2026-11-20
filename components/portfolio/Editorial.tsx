import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowDown, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { contactLinks } from "@/lib/contactData";
import { publicAsset } from "@/lib/publicAsset";
import { changedLine } from "@/lib/devPilotDemo";
import CommandPalette from "@/components/layout/CommandPalette";

export type Project = "earth" | "devpilot" | "asl" | "tickets";
export type Metric = { value: string; label: string };

const work = [
  {
    kind: "earth", title: "Mapping forest canopy height", category: "Earth observation · ISRO",
    href: "/projects/vegetation-height", result: "1.49 m mean absolute error",
    description: "Estimating forest structure from satellite imagery and checking the predictions against airborne LiDAR.",
  },
  {
    kind: "devpilot", title: "DevPilot AI", category: "Software engineering · Agentic AI",
    href: "/projects/devpilot-ai", result: "22 of 30 tasks resolved",
    description: "A workflow that investigates software issues, tests proposed patches and prepares changes for human review.",
  },
  {
    kind: "asl", title: "Sign language recognition", category: "Computer vision · Real-time ML",
    href: "/projects/sign-language", result: "83% test accuracy in the original project",
    description: "Recognizing fingerspelled letters from webcam video using hand landmarks and a CNN.",
  },
  {
    kind: "tickets", title: "Intelligent ticket routing", category: "Production ML · Vegayan Systems",
    href: "/projects/ticket-classification", result: "0.71 → 0.80 macro-F1",
    description: "Classifying Freshdesk tickets and sending uncertain predictions to human review.",
  },
] as const;

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="ed-link">{children}<FiArrowUpRight aria-hidden="true" /></Link>;
}

export function EarthFigure({ priority = false }: { priority?: boolean }) {
  return (
    <figure className="ed-earth-figure">
      <div className="ed-earth-image">
        <Image src={publicAsset("/imagery/rondonia-2012.webp")} alt="Satellite view of forest and branching agricultural clearings in Rondônia, Brazil" fill sizes="(max-width: 768px) 100vw, 1320px" priority={priority} />
        <div className="ed-photo-caption">
          <span>Rondônia, Brazil</span><span>NASA Terra / MODIS · 2012</span>
        </div>
      </div>
      <figcaption className="ed-caption">Public satellite imagery from the time comparison in the canopy-height case study.</figcaption>
    </figure>
  );
}

export function ProjectVisual({ kind }: { kind: Project }) {
  if (kind === "earth") return <EarthFigure />;
  if (kind === "devpilot") {
    return (
      <figure className="ed-visual ed-diff">
        <div className="ed-visual-label"><span>src/readings.ts</span><span>Sample patch</span></div>
        <pre><code>
          <span className="ed-diff-minus">−{changedLine.before.trimStart()}</span>
          <span className="ed-diff-plus">+{changedLine.after.trimStart()}</span>
        </code></pre>
        <figcaption>Keep zero readings and reject nonfinite values.</figcaption>
      </figure>
    );
  }
  if (kind === "asl") {
    return (
      <figure className="ed-visual ed-sign">
        <div className="ed-visual-label">Saved hand landmarks</div>
        <div className="ed-poses">{["B", "L", "Y"].map((letter) => (
          <div key={letter}>
            <Image src={publicAsset(`/models/asl/examples/${letter}.png`)} alt={`Tracked hand pose for ${letter}`} width={96} height={96} unoptimized />
            <span>{letter}</span>
          </div>
        ))}</div>
      </figure>
    );
  }
  return (
    <figure className="ed-visual ed-bars">
      <div className="ed-visual-label">Ticket classification · Macro-F1</div>
      <div className="ed-measurements">
        {[{label:"Baseline", value:0.71}, {label:"Tuned", value:0.80}].map(({label, value}) => (
          <div className="ed-measurement" key={label}>
            <span>{label}</span><meter min={0} max={1} value={value} aria-label={`${label} macro-F1`} />
            <strong>{value.toFixed(2)}</strong>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function WorkList({ includeEarth = false }: { includeEarth?: boolean }) {
  return <div className="ed-work-list">{work.slice(includeEarth ? 0 : 1).map((project) => (
    <article className="ed-work-item" key={project.kind}>
      <div className="ed-work-copy">
        <p className="ed-kicker">{project.category}</p>
        <h3><Link href={project.href}>{project.title}<FiArrowUpRight aria-hidden="true" /></Link></h3>
        <p>{project.description}</p>
        <p className="ed-result">{project.result}</p>
      </div>
      <ProjectVisual kind={project.kind} />
    </article>
  ))}</div>;
}

export function EditorialHome() {
  return (
    <div className="ed">
      <div className="ed-wrap">
        <section className="ed-home-intro" aria-labelledby="home-title">
          <p className="ed-kicker"><span className="ed-dot" />AI engineer · Erlangen, Germany</p>
          <div className="ed-home-grid">
            <h1 id="home-title">Reading Earth<br className="ed-desktop-break" /> from orbit<span>.</span></h1>
            <div className="ed-intro-copy">
              <p>I’m Dhiren Sharma. I build machine learning systems for satellite imagery, computer vision and engineering workflows.</p>
              <Link href="#work" className="ed-link">Explore my work <FiArrowDown aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
        <EarthFigure priority />
        <section className="ed-section" id="work" aria-labelledby="work-title">
          <div className="ed-section-title">
            <h2 id="work-title">Selected work</h2>
            <ArrowLink href="/projects">All projects</ArrowLink>
          </div>
          <article className="ed-feature">
            <div className="ed-work-copy">
              <p className="ed-kicker">{work[0].category}</p>
              <h3><Link href={work[0].href}>{work[0].title}<FiArrowUpRight aria-hidden="true" /></Link></h3>
              <p>{work[0].description}</p>
            </div>
            <Metrics metrics={[{ value: "1.49 m", label: "Mean absolute error" }, { value: "0.86", label: "R² at 25 m scale" }]} />
          </article>
          <WorkList />
        </section>
        <section className="ed-section ed-split" aria-labelledby="home-about">
          <h2 id="home-about">About me</h2>
          <div>
            <p>I’m pursuing an M.Sc. in Artificial Intelligence at FAU Erlangen–Nürnberg. At ISRO’s National Remote Sensing Centre, I worked on estimating forest canopy height. At Vegayan Systems, I built a machine learning workflow for support-ticket routing.</p>
            <ArrowLink href="/about">Experience and education</ArrowLink>
          </div>
        </section>
      </div>
    </div>
  );
}

export function PageHeader({ label, title, children }: { label?: string; title: string; children?: ReactNode }) {
  return (
    <header className="ed-page-header">
      {label && <p className="ed-kicker">{label}</p>}
      <h1>{title}</h1>
      {children && <div className="ed-lead">{children}</div>}
    </header>
  );
}

export function Metrics({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <dl className="ed-metrics">
      {metrics.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  );
}

export function CaseLayout({ kind, title, label, summary, role, method, evaluation, metrics, limitation, children }: {
  kind: Project; title: string; label: string; summary: string; role: string; method: string;
  evaluation: string; metrics: Metric[]; limitation: string; children?: ReactNode;
}) {
  const next = work[(work.findIndex((project) => project.kind === kind) + 1) % work.length];
  return (
    <article className="ed">
      <div className="ed-wrap">
        <Link href="/projects" className="ed-back">← All projects</Link>
        <PageHeader label={label} title={title}>
          <p>{summary}</p>
          {children && <Link className="ed-link" href="#demo">Go to the interactive demo <FiArrowDown aria-hidden="true" /></Link>}
        </PageHeader>
        <ProjectVisual kind={kind} />
        <div className="ed-case-text">
          <section><h2>My role</h2><p>{role}</p></section>
          <section><h2>Approach</h2><p>{method}</p></section>
          <section className="ed-case-results"><h2>Evaluation</h2><p>{evaluation}</p><Metrics metrics={metrics} /></section>
        </div>
      </div>
      {children && <section id="demo" className="ed-lab" aria-labelledby="demo-title">
        <div className="ed-wrap"><h2 id="demo-title">Explore the evidence</h2>{children}</div>
      </section>}
      <div className="ed-wrap">
        <section className="ed-section ed-split"><h2>Limitations</h2><p>{limitation}</p></section>
        <Link className="ed-next" href={next.href}>
          <span><span className="ed-kicker">Next case study</span><strong>{next.title}</strong></span>
          <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function PortfolioFooter() {
  const email = contactLinks[0];
  return <footer className="ed-footer"><div className="ed-wrap ed-footer-inner">
    <div><p className="ed-kicker">Contact</p><h2>Let’s talk about your project.</h2></div>
    <div className="ed-footer-links">
      <a href={email.href} className="ed-link">Email me <FiArrowUpRight aria-hidden="true" /></a>
      <ArrowLink href="/contact">More ways to connect</ArrowLink>
      <ArrowLink href="/mission">Mission lab</ArrowLink>
      <ArrowLink href="/skills">Skills</ArrowLink>
      <ArrowLink href="/experience">Experience</ArrowLink>
      <CommandPalette />
    </div>
    <Link href="/" className="ed-footer-name">Dhiren Sharma</Link>
    <p className="ed-footer-location">Erlangen, Germany</p>
  </div></footer>;
}
