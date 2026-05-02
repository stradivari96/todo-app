import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My Board',
        short_name: 'Board',
        description: 'A Trello-like kanban board',
        theme_color: '#1d7afc',
        background_color: '#1d7afc',
        display: 'standalone',
        start_url: '/todo-app/',
        scope: '/todo-app/',
        icons: [
          { src: '/todo-app/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  base: '/todo-app/',
})
