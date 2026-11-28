import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Kur XAMPP aplanke guli projektas: C:\xampp\htdocs\bookit  ->  /bookit
const PROJECT_PATH = '/bookit'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Naršyklė kreipiasi į /api/auth/login, o Vite tai perduoda Apache serveriui:
      // http://localhost/bookit/api/index.php?r=auth/login
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          const route = url.pathname.replace(/^\/api\/?/, '')
          const extra = url.searchParams.toString()
          return `${PROJECT_PATH}/api/index.php?r=${encodeURIComponent(route).replace(/%2F/g, '/')}${extra ? '&' + extra : ''}`
        },
      },
    },
  },
})
