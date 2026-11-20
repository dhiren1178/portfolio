"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Layer sizes: input frame -> conv feature maps (shrinking) -> flatten -> dense -> output classes
const LAYERS = [4, 6, 5, 7];
const LAYER_X = [8, 34, 60, 88];

function layerNodes(count: number) {
  const spacing = 84 / (count + 1);
  return Array.from({ length: count }, (_, i) => 8 + spacing * (i + 1));
}

export default function NeuralNetworkViz() {
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulseKey((k) => k + 1), 1800);
    return () => clearInterval(interval);
  }, []);

  const nodePositions = LAYERS.map((count) => layerNodes(count));

  return (
    <div className="glass-panel rounded-2xl p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-phosphor-faint mb-4">
        CNN Activation Map
      </p>
      <svg viewBox="0 0 100 92" className="h-40 w-full" aria-hidden="true">
        {/* Connections */}
        {LAYER_X.slice(0, -1).map((x, layerIdx) => {
          const fromNodes = nodePositions[layerIdx];
          const toNodes = nodePositions[layerIdx + 1];
          const toX = LAYER_X[layerIdx + 1];
          return fromNodes.map((fy, fi) =>
            toNodes.map((ty, ti) => (
              <line
                key={`${layerIdx}-${fi}-${ti}`}
                x1={x}
                y1={fy}
                x2={toX}
                y2={ty}
                stroke="#151B26"
                strokeWidth={0.3}
              />
            ))
          );
        })}

        {/* Traveling pulse per layer transition */}
        {LAYER_X.slice(0, -1).map((x, layerIdx) => (
          <motion.circle
            key={`${pulseKey}-${layerIdx}`}
            r={0.9}
            fill="#5EEAD4"
            initial={{
              cx: x,
              cy: nodePositions[layerIdx][0],
              opacity: 0,
            }}
            animate={{
              cx: LAYER_X[layerIdx + 1],
              cy: nodePositions[layerIdx + 1][
                Math.floor(Math.random() * nodePositions[layerIdx + 1].length)
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.5,
              delay: layerIdx * 0.35,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Nodes */}
        {nodePositions.map((nodes, layerIdx) =>
          nodes.map((y, i) => (
            <motion.circle
              key={`${layerIdx}-${i}`}
              cx={LAYER_X[layerIdx]}
              cy={y}
              r={2.2}
              fill={layerIdx === 0 ? "#3E7CB1" : layerIdx === LAYERS.length - 1 ? "#4CAF7D" : "#0B0F16"}
              stroke="#5EEAD4"
              strokeWidth={0.5}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: (layerIdx + i) * 0.15,
                ease: "easeInOut",
              }}
            />
          ))
        )}
      </svg>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-phosphor-faint">
        <span>Input</span>
        <span>Conv</span>
        <span>Dense</span>
        <span>Output</span>
      </div>
    </div>
  );
}
