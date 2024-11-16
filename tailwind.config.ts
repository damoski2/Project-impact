import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFF2DD",
      },
      fontFamily: {
        "Marr-Sans-Cond-SemiBold": ["Marr-Sans-Cond-SemiBold", "sans-serif"],
        "Marr-Sans-Cond-Medium": ["Marr-Sans-Cond-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
