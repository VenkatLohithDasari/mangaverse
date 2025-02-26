import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base backgrounds
        background: {
          primary: '#121212', // neutral-950 (darker than neutral-900 for better contrast)
          secondary: '#1f1f1f', // neutral-900
          tertiary: '#2b2b2b', // neutral-800
          elevated: '#383838', // neutral-700
        },
        // Text colors
        text: {
          primary: '#ffffff', // white
          secondary: '#a1a1aa', // neutral-400
          tertiary: '#71717a', // neutral-500
          disabled: '#52525b', // neutral-600
        },
        // Brand colors
        brand: {
          primary: '#7c3aed', // purple-600
          hover: '#6d28d9', // purple-700
          active: '#5b21b6', // purple-800
          muted: '#4c1d95', // purple-900
          light: '#a78bfa', // purple-400
        },
        // Status colors
        status: {
          success: '#10b981', // emerald-500
          error: '#ef4444', // red-500
          warning: '#f59e0b', // amber-500
          info: '#3b82f6', // blue-500
        }
      }
    }
  },
  plugins: [],
} satisfies Config;
