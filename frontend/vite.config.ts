import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acesso na sua rede local (ex: 192.168.0.5)
    port: 3005, // Porta alterada para 3005
    proxy: {
      // Redireciona requisições de /api para o backend
      '/api': 'http://localhost:5000', // Proxy ajustado para backend na 5000
    },
  },
  optimizeDeps: {
    include: [
      '@mui/material/Select',
      '@mui/material/MenuItem',
      '@tanstack/react-query'
    ]
  }
})