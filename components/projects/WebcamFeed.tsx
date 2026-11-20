"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiCamera, FiCameraOff } from "react-icons/fi";

/**
 * DESIGN / HONESTY NOTE
 * This is a portfolio demo, not a shipped hand-tracking model — there's no
 * MediaPipe or real CNN running in the browser. If the user grants webcam
 * access, we show their live feed with a *stylized, animated* hand-skeleton
 * overlay layered on top (decorative, not actually tracking their hand).
 * If access is denied, unavailable, or never requested, we fall back to a
 * fully simulated scene so the demo still reads as intentional either way.
 */

// A simplified hand skeleton: [x%, y%] anchor points and the edges between
// them, loosely modeled on a MediaPipe-style landmark layout but reduced
// to the points needed for a convincing silhouette.
const HAND_POINTS: [number, number][] = [
  [50, 78], // wrist
  [38, 60], [30, 40], [25, 24], [22, 12], // thumb
  [45, 55], [43, 30], [42, 14], [41, 4], // index
  [52, 55], [52, 26], [52, 8], [52, -2], // middle
  [59, 56], [61, 30], [62, 14], [63, 4], // ring
  [66, 60], [70, 40], [73, 26], [75, 16], // pinky
];

const HAND_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

function HandSkeletonOverlay() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <motion.g
        animate={{
          x: [0, 1.5, -1, 0],
          y: [0, -1, 1.5, 0],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {HAND_EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={HAND_POINTS[a][0]}
            y1={HAND_POINTS[a][1]}
            x2={HAND_POINTS[b][0]}
            y2={HAND_POINTS[b][1]}
            stroke="#5EEAD4"
            strokeWidth={0.4}
            strokeOpacity={0.7}
          />
        ))}
        {HAND_POINTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 1.3 : 0.9} fill="#9AF9E8" />
        ))}
      </motion.g>
    </svg>
  );
}

type WebcamState = "idle" | "requesting" | "live" | "simulated" | "denied";

export default function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<WebcamState>("idle");

  const requestWebcam = async () => {
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState("live");
    } catch {
      setState("denied");
    }
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    return () => {
      const stream = videoEl?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-void-deep">
      {state === "live" ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover -scale-x-100"
        />
      ) : (
        // Simulated backdrop: soft radial glow standing in for a camera feed
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 60%, #12314D 0%, #05070A 70%)",
          }}
        />
      )}

      <HandSkeletonOverlay />

      {/* Status / permission prompt */}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full glass-panel px-3 py-1.5">
        {state === "live" ? (
          <FiCamera className="text-signal" size={12} aria-hidden="true" />
        ) : (
          <FiCameraOff className="text-phosphor-faint" size={12} aria-hidden="true" />
        )}
        <span className="font-mono text-[10px] text-phosphor-dim">
          {state === "live" ? "LIVE FEED" : "SIMULATED DEMO"}
        </span>
      </div>

      {state !== "live" && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-xl glass-panel px-4 py-3">
          <p className="text-xs text-phosphor-dim">
            {state === "denied"
              ? "Camera access denied — showing a simulated demo instead."
              : "Enable your camera, or watch the simulated demo run."}
          </p>
          {state !== "denied" && (
            <button
              onClick={requestWebcam}
              disabled={state === "requesting"}
              className="focus-ring shrink-0 rounded-full bg-signal px-3 py-1.5 text-xs font-semibold text-void hover:bg-signal-bright disabled:opacity-60"
            >
              {state === "requesting" ? "Requesting…" : "Enable Camera"}
            </button>
          )}
        </div>
      )}

      <div className="absolute top-3 right-3 rounded-full glass-panel px-3 py-1.5 font-mono text-[10px] text-canopy-light">
        30 FPS
      </div>
    </div>
  );
}
