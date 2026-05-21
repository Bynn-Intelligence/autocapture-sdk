import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 6073,
    strictPort: true,
    // Allow tunnel hostnames (ngrok / localtunnel / cloudflared) for phone
    // testing over HTTPS - WebCrypto and getUserMedia need a secure context.
    allowedHosts: [".ngrok.app", ".ngrok-free.app", ".loca.lt", ".trycloudflare.com"],
    headers: {
      // onnxruntime-web SIMD threads need cross-origin isolation.
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    exclude: ["onnxruntime-web"],
  },
});
