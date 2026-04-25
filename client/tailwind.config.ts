import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d0d0d",
        surface: "#1a1a1a",
        "surface-alt": "#242424",
        brand: {
          50: "#FFF8ED",
          100: "#F5E6CC",
          200: "#E8D0A4",
          300: "#E0C99A",
          400: "#D4B47E",
          500: "#C8A26B",
          600: "#B08A55",
          700: "#8B6F47",
          800: "#6B5535",
          900: "#4A3B25",
        },
        accent: "#6B2D3E",
        "accent-light": "#8B3D52",
        "text-primary": "#E8E0D8",
        "text-muted": "#8A8078",
        border: "#2E2A26",
        success: "#4A7C59",
        error: "#9B3B3B",
        warning: "#C8A26B",
      },
      fontFamily: {
        display: ['"DM Serif Display"', "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "40px",
        "10": "48px",
        "11": "56px",
        "12": "64px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(200, 162, 107, 0.08)",
        "glass-hover": "0 12px 40px rgba(200, 162, 107, 0.15)",
        glow: "0 0 20px rgba(200, 162, 107, 0.1)",
      },
      backdropBlur: {
        glass: "12px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
        pulse: "pulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
