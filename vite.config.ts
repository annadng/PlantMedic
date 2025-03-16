import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from 'autoprefixer';
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: "./static",
  base: "./",
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});
