import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: 10.188.231.7, // This makes Vite listen on all available network interfaces
  //   port: 5173 // Or any other desired port
  // }
})
