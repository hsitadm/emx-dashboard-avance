import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-dev-[hash].js',
        chunkFileNames: 'assets/[name]-dev-[hash].js',
        assetFileNames: 'assets/[name]-dev-[hash].[ext]'
      }
    }
  }
})
