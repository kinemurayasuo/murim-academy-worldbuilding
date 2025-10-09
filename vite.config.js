import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/murim-academy-worldbuilding/', // GitHub Pages 저장소명에 맞게 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
