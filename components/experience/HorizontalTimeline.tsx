"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { isroTimeline } from "@/lib/experienceData";
import { cn } from "@/lib/utils";

/**
 * A horizontally scrolling timeline (distinct from the vertical one on the
 * About page). Each node sits on a spine; hovering (or tapping, on touch)
 * expands it into a detail card. The spine fill tracks horizontal scroll
 * progress within the strip, not page scroll.
 */
export default function HorizontalTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });
  const fillWidth = useSpring(scrollXProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="relative">
      {/* Spine + progress fill, above the scroll strip */}
      <div className="relative mx-1 mb-2 h-px bg-void-line">
        <motion.div
          style={{ scaleX: fillWidth }}
          className="absolute inset-y-0 left-0 w-full origin-left bg-signal"
        />
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-6 snap-x snap-mandatory scrollbar-none"
        role="list"
        aria-label="ISRO internship timeline, seven stages, scroll horizontally"
      >
        {isroTimeline.map((node, i) => {
          const isActive = activeId === node.id;
          return (
            <motion.div
              key={node.id}
              role="listitem"
              tabIndex={0}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              onMouseEnter={() => setActiveId(node.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(node.id)}
              onBlur={() => setActiveId(null)}
              onClick={() => setActiveId((cur) => (cur === node.id ? null : node.id))}
              animate={{ width: isActive ? 280 : 168 }}
              className={cn(
                "focus-ring group relative shrink-0 snap-start cursor-pointer rounded-2xl border p-5 transition-colors duration-300",
                isActive
                  ? "border-signal/50 bg-void-panel/80"
                  : "border-white/10 bg-void-panel/40 hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-signal">{node.index}</span>
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors duration-300",
                    isActive ? "bg-signal" : "bg-void-line"
                  )}
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-display font-semibold text-base text-phosphor mt-3">
                {node.title}
              </h3>
              <motion.p
                initial={false}
                animate={{
                  height: isActive ? "auto" : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden text-xs text-phosphor-dim leading-relaxed mt-2"
              >
                {node.description}
              </motion.p>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-1 text-xs text-phosphor-faint md:hidden">
        Swipe to explore, tap a stage for detail.
      </p>
    </div>
  );
}
