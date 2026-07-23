"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FiBookOpen, FiBriefcase } from "react-icons/fi";
import { timelineEntries } from "@/lib/aboutData";
import { cn } from "@/lib/utils";

function TimelineCard({
  entry,
  index,
}: {
  entry: (typeof timelineEntries)[number];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 py-10",
        !isEven && "md:flex-row-reverse"
      )}
    >
      {/* Node on the spine */}
      <div className="absolute left-[19px] md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-void-panel border border-signal/40 glow-signal">
          {entry.kind === "education" ? (
            <FiBookOpen className="text-signal" size={16} aria-hidden="true" />
          ) : (
            <FiBriefcase className="text-canopy-light" size={16} aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Card */}
      <div
        className={cn(
          "ml-16 md:ml-0 md:w-[calc(50%-2.5rem)] glass-panel rounded-2xl p-6 md:p-7 hover:border-signal/30 transition-colors duration-300",
          isEven ? "md:text-left" : "md:text-right"
        )}
      >
        <p className="font-mono text-xs tracking-[0.2em] text-signal uppercase mb-2">
          {entry.year}
        </p>
        <h3 className="font-display font-semibold text-xl text-phosphor">
          {entry.title}
        </h3>
        <p className="text-sm text-phosphor-faint mt-1">{entry.org}</p>
        <p className="text-sm text-phosphor-dim mt-3 leading-relaxed">
          {entry.description}
        </p>
        <div
          className={cn(
            "flex flex-wrap gap-2 mt-4",
            !isEven && "md:justify-end"
          )}
        >
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-phosphor-dim font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Spacer for the opposite column on desktop */}
      <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
    </motion.div>
  );
}

export default function AboutTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.4"],
  });
  const lineHeight = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  return (
    <div ref={containerRef} className="relative mt-16">
      {/* Static spine track */}
      <div
        className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-void-line"
        aria-hidden="true"
      />
      {/* Animated fill that draws in as the section scrolls through view */}
      <motion.div
        style={{ scaleY: lineHeight }}
        className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-signal via-canopy-light to-ocean-light"
        aria-hidden="true"
      />

      {timelineEntries.map((entry, i) => (
        <TimelineCard key={entry.id} entry={entry} index={i} />
      ))}
    </div>
  );
}
