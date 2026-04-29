import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Casting-Dashboard/',
  plugins: [
    react(),
    {
      name: 'research-api',
      configureServer(server) {
        server.middlewares.use('/api/research', async (req, res) => {
          res.setHeader('Content-Type', 'application/json')

          if (req.method !== 'POST') {
            res.statusCode = 405
            return res.end(JSON.stringify({ error: 'Method not allowed' }))
          }

          let body = ''
          for await (const chunk of req) body += chunk

          let actorName
          try { actorName = JSON.parse(body).actorName } catch {
            res.statusCode = 400
            return res.end(JSON.stringify({ error: 'Invalid JSON body' }))
          }

          if (!actorName?.trim()) {
            res.statusCode = 400
            return res.end(JSON.stringify({ error: 'actorName is required' }))
          }

          try {
            const { researchActor } = await import('./server/researchActor.js')
            const result = await researchActor(actorName.trim())
            res.end(JSON.stringify(result))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      },
    },
  ],
})
