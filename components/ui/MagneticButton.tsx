"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
}

/**
 * Button that subtly pulls toward the cursor on hover ("magnetic" effect).
 * Keyboard and screen-reader accessible: focus works identically to hover.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.25, y: y * 0.25 });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const styles = cn(
    "focus-ring relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300",
    variant === "primary"
      ? "bg-signal text-void hover:bg-signal-bright"
      : "border border-white/15 text-phosphor hover:border-signal/50 hover:text-signal",
    className
  );

  const motionProps = {
    animate: { x: offset.x, y: offset.y },
    transition: { type: "spring" as const, stiffness: 150, damping: 12, mass: 0.4 },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={styles}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={styles}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
