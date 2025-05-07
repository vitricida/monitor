import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      headers: {
        "Content-Security-Policy":
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; object-src 'none'",
        Link: "<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
      },
    },
    define: {
      "process.env": {},
      global: "globalThis",
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "google-maps": ["@react-google-maps/api"],
          },
        },
      },
    },
  };
});
