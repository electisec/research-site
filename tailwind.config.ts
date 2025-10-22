import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        title: "#080444",
        body: "#7e7e7e",
        emeraldlight: "#3ee680",
        darkgreen: "#15803d",
      },
    },
  },
  plugins: [
    typography
  ],
} satisfies Config;