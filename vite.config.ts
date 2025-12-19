import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-router")) return "router";
            if (id.includes("recharts") || id.includes("d3")) return "charts";
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("firebase")) return "firebase";
            if (id.includes("zustand")) return "state";
            return "vendor";
          }
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
