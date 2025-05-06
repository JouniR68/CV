import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({

  optimizeDeps: {
    exclude: ['date-fns'],
  },
  plugins: [
    react(),
    /*VitePWA({
      //registerType: 'autoUpdate',
      /*workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          },
        ],
      },
      */
      /*manifest: {
        name: 'Softa-Apu',
        short_name: 'Softa-Apu',
        description: 'My awesome softa-apu app',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/SELF_TRACK_192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/SELF_TRACK_512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }

    })*/
  ]
})
