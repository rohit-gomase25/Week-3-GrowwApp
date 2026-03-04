import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Add this line - MUST match your repository name exactly
  base: "/Week-3-GrowwApp/", 
  plugins: [react()],
  resolve: {
    alias: { "@": "/src" },
  },
});
