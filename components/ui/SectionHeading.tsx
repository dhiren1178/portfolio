"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Consistent section header used across the site: a mono-font eyebrow
 * label, a large display title, and an optional supporting line.
 * Reveals once when scrolled into view (not on every scroll pass).
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="font-mono text-xs tracking-[0.3em] text-signal uppercase mb-3">
        {eyebrow}
      </p>
      <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-phosphor leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-phosphor-dim text-base md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
