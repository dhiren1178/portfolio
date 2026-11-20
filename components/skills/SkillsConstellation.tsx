"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skillNodes, skillEdges, type SkillNode } from "@/lib/skillsData";

const CATEGORY_COLOR: Record<SkillNode["category"], string> = {
  ai: "#5EEAD4", // signal
  geospatial: "#4CAF7D", // canopy
  engineering: "#3E7CB1", // ocean
};

export default function SkillsConstellation() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const neighborMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    skillNodes.forEach((n) => map.set(n.id, new Set()));
    skillEdges.forEach(([a, b]) => {
      map.get(a)?.add(b);
      map.get(b)?.add(a);
    });
    return map;
  }, []);

  const activeNeighbors = activeId ? neighborMap.get(activeId) ?? new Set() : null;

  const isDimmed = (id: string) => {
    if (!activeId) return false;
    if (id === activeId) return false;
    return !activeNeighbors?.has(id);
  };

  const nodeById = (id: string) => skillNodes.find((n) => n.id === id)!;

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 100 100"
        className="h-[520px] w-full md:h-[600px]"
        role="group"
        aria-label="Constellation graph of skills, grouped into AI & Research, Geospatial, and Engineering clusters connected around a central Python node"
      >
        {/* Edges */}
        <g>
          {skillEdges.map(([a, b], i) => {
            const from = nodeById(a);
            const to = nodeById(b);
            const dimmed = activeId
              ? !(a === activeId || b === activeId)
              : false;
            const highlighted = activeId && (a === activeId || b === activeId);
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={highlighted ? "#5EEAD4" : "#1F2733"}
                strokeWidth={highlighted ? 0.35 : 0.18}
                opacity={dimmed ? 0.15 : 1}
                style={{ transition: "opacity 0.3s ease, stroke 0.3s ease" }}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {skillNodes.map((node, i) => {
            const active = activeId === node.id;
            const dimmed = isDimmed(node.id);
            const color = CATEGORY_COLOR[node.category];
            return (
              <g
                key={node.id}
                onMouseEnter={() => setActiveId(node.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(node.id)}
                onBlur={() => setActiveId(null)}
                tabIndex={0}
                role="button"
                aria-label={node.label}
                aria-pressed={active}
                onClick={() => setActiveId(active ? null : node.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveId(active ? null : node.id);
                  }
                }}
                className="cursor-pointer outline-none"
                style={{ opacity: dimmed ? 0.25 : 1, transition: "opacity 0.3s ease" }}
              >
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={active ? color : "#0B0F16"}
                  stroke={color}
                  strokeWidth={active ? 0.5 : 0.3}
                  animate={{
                    r: active ? node.size * 1.35 : node.size,
                    opacity: [1, 0.75, 1],
                  }}
                  transition={{
                    r: { duration: 0.3, ease: "easeOut" },
                    opacity: {
                      duration: 3 + (i % 4),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.15,
                    },
                  }}
                />
                <text
                  x={node.x}
                  y={node.y + node.size + 3.2}
                  textAnchor="middle"
                  className="select-none"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: active ? 3.1 : 2.5,
                    fill: active ? "#EDEFF2" : "#9AA3B2",
                    transition: "font-size 0.3s ease, fill 0.3s ease",
                  }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-5 font-mono text-[10px] text-phosphor-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLOR.ai }} />
          AI & Research
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLOR.geospatial }} />
          Geospatial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLOR.engineering }} />
          Engineering
        </span>
      </div>
    </div>
  );
}
