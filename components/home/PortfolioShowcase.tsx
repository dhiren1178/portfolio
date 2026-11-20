"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { portfolioProjects } from "@/lib/portfolioData";
import { publicAsset } from "@/lib/publicAsset";

const projectLinks = {
  "vegetation-height": "Open case study",
  "devpilot-ai": "Explore DevPilot",
  "sign-language": "Explore sign recognition",
  "ticket-classification": "Explore ticket routing",
};

export default function PortfolioShowcase() {
  const [mode, setMode] = useState<"explore" | "engineer">("explore");

  return (
    <div className="portfolio-home">
      <section id="selected-work" className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="orbital-kicker"><span /> PORTFOLIO</p>
            <h2 className="portfolio-section-heading mt-4">Selected work</h2>
          </div>
          <div role="group" aria-label="Portfolio view" className="portfolio-switch">
            {(["explore", "engineer"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={mode === option}
                onClick={() => setMode(option)}
                className="focus-ring"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {portfolioProjects.map((project, index) => (
            <Link key={project.slug} href={project.href} className={`portfolio-card portfolio-card-${index} focus-ring`}>
              {index === 0 && (
                <Image
                  src={publicAsset("/imagery/rondonia-2012.webp")}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  unoptimized
                  className="portfolio-card-image"
                />
              )}
              {index === 1 && (
                <div className="portfolio-card-code" aria-hidden="true">
                  <span>readings.ts</span>
                  <code className="removed">− values.filter(Boolean)</code>
                  <code className="added">+ values.filter(Number.isFinite)</code>
                  <span>Sample patch from the walkthrough</span>
                </div>
              )}
              <div className="portfolio-card-content">
                <p className="font-mono text-xs uppercase leading-relaxed tracking-wider text-[#a9f2cc]">{project.category}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{project.title}</h3>
                {mode === "explore" ? (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#d0dbd7]">{project.summary}</p>
                ) : (
                  <p className="mt-3 max-w-md font-mono text-sm leading-relaxed text-[#d0dbd7]">{project.stack.join(" · ")}</p>
                )}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[#dceae4]">
                  {project.metrics.slice(0, 2).map((metric) => <span key={metric}>{metric}</span>)}
                </div>
                <span className="portfolio-card-link mt-6">{projectLinks[project.slug]} <FiArrowUpRight aria-hidden="true" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Labs and research" className="mx-auto grid max-w-[1440px] gap-3 px-6 pb-20 md:grid-cols-2 md:px-12 lg:px-20">
        <Link className="portfolio-text-link focus-ring" href="/mission">
          <span><strong>Satellite Mission Lab</strong><small>Explore orbital profiles and ground tracks.</small></span>
          <FiArrowUpRight aria-hidden="true" />
        </Link>
        <Link className="portfolio-text-link focus-ring" href="/research">
          <span><strong>Research Notebook</strong><small>Read the methods, results and limitations behind the projects.</small></span>
          <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-6 px-6 py-12 md:px-12 lg:px-20">
          <p className="font-display text-2xl font-semibold">Dhiren Sharma</p>
          <Link href="/contact" className="orbital-button orbital-button-secondary focus-ring">Get in touch <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      </footer>
    </div>
  );
}
