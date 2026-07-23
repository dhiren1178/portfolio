"use client";

import { useEffect, useRef } from "react";

/**
 * A small glowing "sensor reticle" that trails the cursor on desktop.
 * Disabled on touch devices and when reduced-motion is requested.
 */
export default function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || prefersReducedMotion) return;

    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    let rafId: number;
    const animate = () => {
      ringX += (targetX - ringX) * 0.15;
      ringY += (targetY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
      <div
        ref={dotRef}
        className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-signal"
      />
      <div
        ref={ringRef}
        className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border border-signal/40"
      />
    </div>
  );
}
