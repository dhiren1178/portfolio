import Image from "next/image";
import Link from "next/link";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { publicAsset } from "@/lib/publicAsset";

export default function HeroSection() {
  return (
    <section className="orbital-hero" aria-label="Introduction">
      <div className="orbital-frame" aria-hidden="true">
        <div className="orbital-planet">
          <Image
            src={publicAsset("/imagery/earth-epic.webp")}
            alt=""
            width={1200}
            height={1200}
            priority
            unoptimized
          />
        </div>
        <div className="orbital-arc orbital-arc-outer" />
        <div className="orbital-arc orbital-arc-inner" />
        <div className="orbital-marker"><span /></div>
      </div>

      <div className="orbital-content mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20">
        <p className="orbital-kicker"><span /> AI ENGINEER / ERLANGEN, DE</p>
        <h1>Dhiren<br />Sharma<span>.</span></h1>
        <p className="orbital-intro">
          I build machine learning systems for satellite imagery, computer vision, and software engineering.
        </p>
        <div className="orbital-actions">
          <Link className="orbital-button orbital-button-primary focus-ring" href="#selected-work">
            Explore my work <FiArrowDown aria-hidden="true" />
          </Link>
          <a className="orbital-button orbital-button-secondary focus-ring" href={publicAsset("/resume.pdf")} download>
            Download CV <FiArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="orbital-caption mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20">
        <span>M.Sc. Artificial Intelligence · FAU</span>
        <a
          href="https://www.nasa.gov/news-release/nasa-satellite-camera-provides-epic-view-of-earth/"
          target="_blank"
          rel="noreferrer"
        >
          Earth imagery by NASA / DSCOVR EPIC <FiArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
