import type { Config } from "tailwindcss";

// Design tokens for "Exploring Earth through AI"
// Palette grounded in orbital/EO imagery, not generic dark-mode defaults:
//  - void:      the black of deep space between orbits
//  - ocean:     Earth-blue, the planet's dominant color from orbit
//  - canopy:    forest green, vegetation / biomass signal color
//  - signal:    satellite cyan, the color of active sensor readouts
//  - phosphor:  soft white, terminal/readout text
//  - flare:     warm amber, used ONLY for the "processing / attention" state
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#05070A",
          deep: "#030406",
          panel: "#0B0F16",
          line: "#151B26",
        },
        ocean: {
          DEFAULT: "#1C4E80",
          light: "#3E7CB1",
          dim: "#12314D",
        },
        canopy: {
          DEFAULT: "#2E7D5B",
          light: "#4CAF7D",
          dim: "#1C4B38",
        },
        signal: {
          DEFAULT: "#5EEAD4",
          bright: "#9AF9E8",
          dim: "#1F6E63",
        },
        phosphor: {
          DEFAULT: "#EDEFF2",
          dim: "#9AA3B2",
          faint: "#5B6472",
        },
        flare: {
          DEFAULT: "#F2A65A",
          dim: "#8A5A28",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, transparent, rgba(94,234,212,0.04) 40%, transparent)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        scan: "scan 2.4s linear infinite",
        orbit: "orbit 40s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
