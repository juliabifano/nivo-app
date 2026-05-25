export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nivo: {
          bg: "#0B0F1A",

          card: {
            DEFAULT: "#111827",
            soft: "rgba(255,255,255,0.05)",
            hover: "rgba(255,255,255,0.08)",
          },

          border: {
            DEFAULT: "rgba(255,255,255,0.10)",
            soft: "rgba(255,255,255,0.06)",
          },

          text: {
            primary: "#FFFFFF",
            secondary: "#A0A7B1",
            muted: "#6B7280",
          },

          success: {
            DEFAULT: "#3EF2C2",
            soft: "rgba(62,242,194,0.12)",
          },

          danger: {
            DEFAULT: "#FF7A6B",
            soft: "rgba(255,122,107,0.12)",
          },

          warning: {
            DEFAULT: "#FBBF24",
            soft: "rgba(251,191,36,0.12)",
          },
        },
      },
      borderRadius: {
        nivo: "28px",
        "nivo-sm": "18px",
        "nivo-xs": "14px",
      },

      spacing: {
        "nivo-card": "20px",
        "nivo-gap": "16px",
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
