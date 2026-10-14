import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.svg'],
      manifest: {
        name: 'Hope House Travel',
        short_name: 'HopeHouse',
        description: 'Canada, UK, Norway, USA visas - Apply, track status, docs, payments, chat',
        theme_color: '#0f1e3a',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          { urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i, handler: 'NetworkFirst', options: { cacheName: 'firestore-cache', expiration: { maxEntries: 100, maxAgeSeconds: 3600 } } }
        ]
      }
    })
  ]
})
