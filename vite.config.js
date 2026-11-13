import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, /n8n/* is proxied to your local n8n so the browser never hits CORS.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      allowedHosts: [
        "elude-washbowl-elixir.ngrok-free.dev"
      ],
      proxy: {
        '/n8n': {
          target: env.N8N_BASE_URL || 'http://localhost:5678' || 'https://elude-washbowl-elixir.ngrok-free.dev',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/n8n/, ''),
        },
      },
    },
  }
})
