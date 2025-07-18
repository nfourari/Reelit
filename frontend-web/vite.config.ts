// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const apiTarget =
    mode === "development"
      ? "http://localhost:5001/api/users"
      : "https://shuzzy.top/api/users";

  return {
    base: "/",
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      assetsDir: "assets",
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name].[ext]",
          chunkFileNames: "assets/[name].js",
          entryFileNames: "assets/[name].js",
        },
      },
    },
  };
});
