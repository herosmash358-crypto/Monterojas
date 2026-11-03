import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          DEFAULT: "#2B1B12",
          dark: "#1c120c",
          light: "#3a2519",
        },
        tierra: {
          DEFAULT: "#5A3A24",
          light: "#744b30",
          dark: "#432a19",
        },
        crema: {
          DEFAULT: "#F6EEE0",
          light: "#FAF5ED",
          dark: "#EDE2CF",
        },
        lino: {
          DEFAULT: "#EADCC4",
          light: "#F2E8D7",
          dark: "#DCCBB0",
        },
        ocre: {
          DEFAULT: "#D49A2A",
          hover: "#B8821C",
          light: "#E4B04C",
          dark: "#9E6D14",
        },
        bosque: {
          DEFAULT: "#2F4A36",
          dark: "#223527",
          light: "#3e6147",
        },
        oliva: {
          DEFAULT: "#6B7040",
          light: "#82894f",
          dark: "#525631",
        },
        salvia: {
          DEFAULT: "#A9B796",
          light: "#C0CDB0",
          dark: "#8C9B7A",
        },
        alerta: {
          error: "#A63D2F",
          exito: "#2F4A36",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(43, 27, 18, 0.08)",
        card: "0 6px 24px -4px rgba(43, 27, 18, 0.1)",
        elevated: "0 12px 32px -6px rgba(43, 27, 18, 0.16)",
      },
      borderRadius: {
        craft: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
