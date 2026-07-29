import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2019",
    outDir: "dist",
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
