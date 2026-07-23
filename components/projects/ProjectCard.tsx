"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  index: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
  gradient: string;
}

/**
 * Large project preview card with a subtle tilt-toward-cursor effect.
 * When `href` is omitted, renders as a disabled "coming soon" state.
 */
export default function ProjectCard({
  index,
  title,
  description,
  tags,
  href,
  gradient,
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -4, y: px * 6 });
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-10 min-h-[320px] flex flex-col justify-between",
        !href && "opacity-60"
      )}
    >
      <div className={cn("absolute inset-0 opacity-40", gradient)} aria-hidden="true" />
      <div className="absolute inset-0 bg-void/50" aria-hidden="true" />

      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs text-signal">{index}</span>
        {href ? (
          <FiArrowUpRight
            className="text-phosphor-dim transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-signal"
            size={20}
            aria-hidden="true"
          />
        ) : (
          <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] text-phosphor-faint">
            IN PROGRESS
          </span>
        )}
      </div>

      <div className="relative">
        <h3 className="font-display font-bold text-2xl md:text-3xl text-phosphor mb-3">
          {title}
        </h3>
        <p className="text-phosphor-dim text-sm md:text-base max-w-md mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-phosphor-dim font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="focus-ring block rounded-3xl" aria-label={`View project: ${title}`}>
      {content}
    </Link>
  );
}
