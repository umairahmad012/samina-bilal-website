import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial cream/linen background — warmer than white
        cream: "#F2EFEA",
        "cream-soft": "#EDE9E2",
        // Deep oxblood / burgundy accent (from Carolwood study)
        oxblood: {
          DEFAULT: "#3B1418",
          dark: "#2A0E11",
          light: "#5C1F25",
        },
        // Body type
        ink: "rgba(0, 0, 0, 0.82)",
        "ink-muted": "rgba(0, 0, 0, 0.55)",
        "ink-subtle": "rgba(0, 0, 0, 0.35)",
        // Inverse for over-photo type
        "ink-on-dark": "rgba(255, 255, 255, 0.95)",
      },
      fontFamily: {
        // Single typeface system (Carolwood pattern)
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      fontWeight: {
        thin: "200",
        light: "300",
        normal: "400",
      },
      letterSpacing: {
        tightest: "-0.02em",
        tight: "-0.01em",
        normal: "0",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.25em",
        "ultra-wide": "0.4em",
      },
      fontSize: {
        // Hero / display
        "display-xl": ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "0.05em", fontWeight: "200" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "0.04em", fontWeight: "200" }],
        "section-title": ["clamp(1.5rem, 2.8vw, 2rem)", { lineHeight: "1.2", letterSpacing: "0.08em", fontWeight: "300" }],
        "card-title": ["1.625rem", { lineHeight: "1.25", letterSpacing: "0.04em", fontWeight: "300" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.25em", fontWeight: "400" }],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.18)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fadeIn 1s ease forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
