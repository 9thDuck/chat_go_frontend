import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { Buffer } from "buffer";

globalThis.Buffer = Buffer;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@noble/curves")) {
            return "noble-curves";
          } else if (id.includes("@noble/ciphers")) {
            return "noble-ciphers";
          } else if (id.includes("@noble/hashes")) {
            return "noble-hashes";
          } else if (id.includes("buffer")) {
            return "buffer";
          }
        },
      },
    },
  },
});
