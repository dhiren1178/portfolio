import Link from "next/link";
import { portfolioProjects } from "@/lib/portfolioData";
export default function CaseStudy({slug}:{slug:string}) {
 const project = portfolioProjects.find(p=>p.slug===slug);
 if (!project) return null;
 return <article className="min-h-screen bg-void px-6 pb-24 pt-36 md:px-16"><div className="mx-auto max-w-5xl">
 <Link href="/projects" className="font-mono text-xs text-signal hover:underline">← ALL PROJECTS</Link>
 <p className="mt-16 font-mono text-xs uppercase tracking-[0.3em] text-signal">{project.category}</p>
 <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight text-phosphor md:text-6xl">{project.title}</h1>
 <p className="mt-7 max-w-2xl text-lg leading-relaxed text-phosphor-dim">{project.summary}</p>
 <div className="mt-12 grid gap-4 sm:grid-cols-3">{project.metrics.map(metric=><div key={metric} className="panel-hairline rounded-2xl border border-white/10 bg-void-panel p-6 font-display text-xl font-semibold text-phosphor">{metric}</div>)}</div>
 <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-2"><section><h2 className="font-display text-2xl font-semibold text-phosphor">Engineering approach</h2><p className="mt-4 leading-relaxed text-phosphor-dim">This case study presents the implementation described in my resume. Technical artifacts, architecture diagrams and reproducible examples can be added here as they become available.</p></section><section><h2 className="font-display text-2xl font-semibold text-phosphor">Technology</h2><div className="mt-4 flex flex-wrap gap-2">{project.stack.map(tag=><span className="rounded-full border border-white/15 px-3 py-2 font-mono text-xs text-phosphor-dim" key={tag}>{tag}</span>)}</div></section></div>
 <p className="mt-16 border-l-2 border-signal/50 pl-5 text-sm leading-relaxed text-phosphor-dim">Figures are project evaluation results as reported in the resume, not live predictions. Interactive visualizations elsewhere on this website may use illustrative data.</p>
 </div></article>;
}
