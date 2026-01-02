import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 30px rgba(0,0,0,0.08)",
      },
      backgroundImage: {
        "gradient-soft":
          "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(16,185,129,0.06))",
      },
    },
  },
  plugins: [],
};

export default config;
