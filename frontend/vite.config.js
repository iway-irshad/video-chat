import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'angeline-undecayable-exceptionally.ngrok-free.dev',
      '.ngrok-free.dev', // Allow all ngrok-free.dev subdomains
      '.ngrok.io',       // Allow all ngrok.io subdomains (if using paid ngrok)
    ],
    host: true, // Allow access from network
  },
})
