import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  // 🔴 این خط برای گیت‌هاب حیاتی است (دقیقاً نام مخزن شما)
  base: '/luma-app/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      },
      includeAssets: [
        'favicon.svg',
        'icons/icon.svg',
        'icons/icon-maskable.svg'
      ],
      manifest: {
        name: 'LUMA - نجوم و تاروت',
        short_name: 'LUMA',
        description: 'اپلیکیشن آفلاین نجوم، تاروت و خودشناسی از Lumera',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/luma-app/',
        start_url: '/luma-app/',
        lang: 'fa',
        dir: 'rtl',
        categories: ['lifestyle', 'entertainment', 'education'],
        icons: [
          {
            src: '/luma-app/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/luma-app/icons/icon-maskable.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,svg,png,jpg,jpeg,gif,woff,woff2,ttf,eot,mp3}'
        ],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        cleanupOutdatedCaches: true
      }
    })
  ],
  resolve: {
    alias: {
      // استفاده از import.meta.dirname برای رفع هشدار Vite
      '@': path.resolve(import.meta.dirname, './src')
    }
  }
})