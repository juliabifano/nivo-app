export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nivo-bg": "#0B0F1A",
        "nivo-card": "#111827",
        "nivo-muted": "#A0A7B1",
        "nivo-mint": "#3EF2C2",
        "nivo-error": "#FF7A6B",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
