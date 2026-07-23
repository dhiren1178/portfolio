"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/lib/aboutData";

function SkillChip({ skill, index }: { skill: string; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.05 }}
      className="group relative cursor-default rounded-xl border border-white/10 bg-void-panel/40 px-4 py-3 text-sm text-phosphor-dim transition-colors duration-300 hover:border-signal/50 hover:text-phosphor hover:glow-signal"
    >
      {skill}
      <span
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120px circle at 50% 0%, rgba(94,234,212,0.12), transparent 70%)",
        }}
        aria-hidden="true"
      />
    </motion.li>
  );
}

export default function SkillsGrid() {
  return (
    <div className="mt-16 grid gap-10 md:grid-cols-3">
      {skillGroups.map((group) => (
        <div key={group.label}>
          <h3 className="font-mono text-xs tracking-[0.25em] text-canopy-light uppercase mb-4">
            {group.label}
          </h3>
          <ul className="flex flex-wrap gap-2.5">
            {group.skills.map((skill, i) => (
              <SkillChip key={skill} skill={skill} index={i} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
