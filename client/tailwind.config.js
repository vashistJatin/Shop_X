/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F8F7F4", bg2: "#F1EFE9",
        surface: "#FFFFFF", surface2: "#F5F4F1",
        border: "#E8E5DE", border2: "#D9D5CC",
        ink: "#1A1814", ink2: "#2D2A25",
        "ink-muted": "#6B6560", "ink-faint": "#A8A49C",
        brand: { DEFAULT: "#2563EB", dark: "#1D4ED8", light: "#3B82F6" },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
        mono: ["DM Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.08)",
        brand: "0 4px 16px rgba(37,99,235,0.25)",
      },
    },
  },
  plugins: [],
};
