"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { contactLinks, availability } from "@/lib/contactData";

export default function ContactCard() {
  return (
    <div className="panel-hairline glass-panel mx-auto max-w-lg rounded-2xl p-8 md:p-10">
      <div className="mb-8 flex items-center gap-2">
        <motion.span
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-1.5 w-1.5 rounded-full bg-canopy-light"
          aria-hidden="true"
        />
        <span className="font-mono text-xs text-phosphor-dim">
          {availability.label}
        </span>
      </div>

      <ul className="divide-y divide-white/[0.06]">
        {contactLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.li
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <a
                href={link.href}
                download={link.href.endsWith(".pdf") ? true : undefined}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="focus-ring group flex items-center justify-between py-4"
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className="text-phosphor-faint transition-colors duration-300 group-hover:text-signal"
                    size={16}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-sm text-phosphor">{link.label}</span>
                    <span className="block text-xs text-phosphor-faint">{link.value}</span>
                  </span>
                </span>
                <FiArrowUpRight
                  className="text-phosphor-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                  size={16}
                  aria-hidden="true"
                />
              </a>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
