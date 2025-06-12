import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Porta onde o servidor de desenvolvimento rodará
  },
  build: {
    outDir: 'dist', 
  },
});
