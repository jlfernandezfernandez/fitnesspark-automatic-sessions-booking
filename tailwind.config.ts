import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "yellow-fitnesspark": "#ffd600",
        "gray-fitnesspark": "rgb(60, 69, 77)",
      },
      fontFamily: {
        cactus: ["CactusBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
