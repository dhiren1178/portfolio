"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { FiArrowDown } from "react-icons/fi";

// Canvas must be client-only; dynamic-import with ssr:false keeps first
// paint fast and avoids WebGL context issues during server render.
const EarthCanvas = dynamic(() => import("@/components/hero/EarthCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-24 w-24 rounded-full border border-signal/20 animate-pulse-slow" />
    </div>
  ),
});

const wordVariants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function RevealLine({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={cnLine(className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.28em]">
          <motion.span
            className="inline-block"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={wordVariants}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function cnLine(className?: string) {
  return className ?? "";
}

export default function HeroSection() {
  return (
    <section
      className="relative h-[100svh] w-full overflow-hidden bg-void"
      aria-label="Introduction"
    >
      {/* 3D Earth background */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <EarthCanvas />
        </Suspense>
        {/* Vignette so text stays legible over the globe */}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/70 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
      </div>

      {/* Foreground copy */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-24 md:px-16 md:pb-32 max-w-5xl">
        <p className="mb-4 font-mono text-xs tracking-[0.3em] text-signal uppercase">
          Exploring Earth through AI
        </p>

        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-phosphor">
          <RevealLine text="Hi, I'm Dhiren Sharma." />
          <br />
          <RevealLine text="Artificial Intelligence Engineer." className="text-gradient-earth" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-base md:text-lg text-phosphor-dim"
        >
          Building intelligent systems for Earth Observation, Computer Vision
          and Geospatial AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="/projects" variant="primary">
            Explore My Work
          </MagneticButton>
          <MagneticButton href="/resume.pdf" variant="ghost">
            Download Resume
          </MagneticButton>
          <MagneticButton href="/contact" variant="ghost">
            Contact Me
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 text-phosphor-faint"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] [writing-mode:vertical-rl]">
          SCROLL
        </span>
        <FiArrowDown className="animate-bounce" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
