import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("dexie")) return "vendor-dexie";
            if (id.includes("lucide-react")) return "vendor-lucide";
            if (id.includes("@tsparticles")) return "vendor-particles";
            if (id.includes("astronomy-engine")) return "vendor-astro";
            return "vendor";
          }
        },
      },
    },
  },
  base: "/luma-app/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
      includeAssets: [
        "favicon.svg",
        "icons/icon-192x192.png",
        "icons/icon-512x512.png",
        "icons/icon-maskable-192x192.png",
        "icons/icon-maskable-512x512.png",
      ],
      manifest: {
        name: "LUMA — تاروت و آسترولوژی",
        short_name: "LUMA",
        description: "سفری به دنیای درون — تاروت، چارت تولد و خودشناسی",
        theme_color: "#0B0D1A",
        background_color: "#0B0D1A",
        display: "standalone",
        orientation: "portrait",
        scope: "/luma-app/",
        start_url: "/luma-app/",
        lang: "fa",
        dir: "rtl",
        icons: [
          { src: "/luma-app/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/luma-app/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/luma-app/icons/icon-maskable-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/luma-app/icons/icon-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,gif,woff,woff2,ttf,eot}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "gstatic-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
});
