import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0a0a0a",
          surface: "#111111",
          elevated: "#1a1a1a",
          overlay: "rgba(0,0,0,0.72)",
        },
        accent: {
          primary: "#E8212B",
          hover: "#FF3340",
          muted: "rgba(232,33,43,0.15)",
        },
        vip: {
          gold: "#C9A84C",
          "gold-muted": "rgba(201,168,76,0.18)",
        },
        seat: {
          available: "#2a3a2a",
          "available-hover": "#3d6b3d",
          held: "#7a6a1a",
          booked: "#3a1a1a",
          selected: "#E8212B",
          vip: "#C9A84C",
          "admin-block": "#4a1a4a",
          empty: "transparent",
        },
        text: {
          primary: "#F2F0EB",
          secondary: "#9A9890",
          muted: "#5A5856",
          inverse: "#0a0a0a",
        },
        border: {
          default: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.15)",
        },
        status: {
          success: "#1d7a3a",
          warning: "#a87c1a",
          error: "#E8212B",
          info: "#1a4a7a",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        heading: ["'DM Sans'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        georgian: ["'BPG Arial'", "'Sylfaen'", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.92", letterSpacing: "0.04em", fontWeight: "400" }],
        h1: ["clamp(2rem, 5vw, 4rem)", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["clamp(1.4rem, 3vw, 2.2rem)", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["1.1rem", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["0.9rem", { lineHeight: "1.7", fontWeight: "400" }],
        small: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em", fontWeight: "400" }],
        "mono-sm": ["0.85rem", { lineHeight: "1.5" }],
        label: ["0.68rem", { lineHeight: "1.5", letterSpacing: "0.12em", fontWeight: "600" }],
      },
      spacing: {
        "container-max": "1200px",
      },
      maxWidth: {
        container: "1200px",
      },
      padding: {
        "container-x": "clamp(16px, 4vw, 48px)",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.6)",
        modal: "0 24px 80px rgba(0,0,0,0.9)",
        glow: "0 0 32px rgba(232,33,43,0.35)",
        "glow-gold": "0 0 24px rgba(201,168,76,0.4)",
        "seat-hover": "0 0 12px rgba(232,33,43,0.6)",
      },
      transitionTimingFunction: {
        default: "cubic-bezier(0.4,0,0.2,1)",
        spring: "cubic-bezier(0.34,1.56,0.64,1)",
        cinema: "cubic-bezier(0.76,0,0.24,1)",
      },
      transitionDuration: {
        instant: "80ms",
        fast: "180ms",
        base: "300ms",
        slow: "500ms",
        reveal: "700ms",
      },
      animation: {
        "fade-up": "fadeUp 500ms cubic-bezier(0.76,0,0.24,1) forwards",
        "clip-reveal": "clipReveal 900ms cubic-bezier(0.76,0,0.24,1) forwards",
        "seat-pop": "seatPop 180ms cubic-bezier(0.34,1.56,0.64,1)",
        "slide-in-right": "slideInRight 300ms cubic-bezier(0.76,0,0.24,1)",
        "slide-out-right": "slideOutRight 300ms cubic-bezier(0.76,0,0.24,1)",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "counter-tick": "counterTick 300ms cubic-bezier(0.34,1.56,0.64,1)",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        clipReveal: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0% 0 0)" },
        },
        seatPop: {
          "0%": { transform: "scale(0.6)" },
          "60%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(120px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(120px)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(232,33,43,0)" },
          "50%": { boxShadow: "0 0 32px rgba(232,33,43,0.35)" },
        },
        counterTick: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "hero-vignette": "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)",
        "screen-bar": "linear-gradient(90deg, transparent, #E8212B, transparent)",
      },
      backdropBlur: {
        nav: "20px",
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
