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
      animation: {
        text: "text 5s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
