import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-serif", "serif"],
      },
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        "bg-2": "rgb(var(--color-bg-2) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-2": "rgb(var(--color-accent-2) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
      },
      boxShadow: {
        soft: "0 20px 60px -40px rgba(15, 23, 42, 0.65)",
        depth: "0 25px 80px -30px rgba(15, 23, 42, 0.8)",
      },
      borderRadius: {
        xl: "28px",
        "2xl": "32px",
      },
      backdropBlur: {
        glass: "22px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.65" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        glow: "glow 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
