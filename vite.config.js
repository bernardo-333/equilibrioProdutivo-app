import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/compat/app', 'firebase/compat/auth', 'firebase/compat/database'],
        },
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Equilíbrio Produtivo',
        short_name: 'Equilíbrio',
        id: './',
        scope: './',
        start_url: './',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        background_color: '#1E1E1E',
        theme_color: '#72fe8f',
        description: 'App para rastreamento de rotina e gestão financeira pessoal.',
        icons: [
          { src: './images/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: './images/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: './images/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: './images/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,png,svg,ico,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache' },
          },
        ],
      },
    }),
  ],
})
