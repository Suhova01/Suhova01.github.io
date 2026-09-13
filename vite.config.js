import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// Vite dev-сервер по умолчанию перенаправляет любой путь без точки (например
// /admin) на index.html React-приложения (SPA fallback), из-за чего
// public/admin/index.html (страница Decap CMS) не открывается напрямую.
// Плюс браузеру важен слэш на конце: без него относительный запрос
// config.yml внутри Decap CMS уходит не в /admin/config.yml, а в /config.yml.
// Поэтому здесь два шага: сначала настоящий редирект /admin → /admin/,
// затем отдаём index.html именно для /admin/.
function serveAdminPage() {
  return {
    name: 'serve-admin-page',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin') {
          res.writeHead(301, { Location: '/admin/' })
          res.end()
          return
        }
        if (req.url === '/admin/') {
          req.url = '/admin/index.html'
        }
        next()
      })
    },
  }
}
 
export default defineConfig({
  plugins: [react(), serveAdminPage()],
})
 
