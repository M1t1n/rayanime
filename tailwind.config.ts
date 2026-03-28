import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          secondary: "#12121a",
          tertiary: "#1a1a2e",
          card: "#16162a",
        },
        accent: {
          primary: "#e63946",
          secondary: "#ff6b81",
          glow: "#e6394633",
        },
        text: {
          primary: "#eaeaea",
          secondary: "#8888a0",
          muted: "#555570",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
