import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 會把網站放在 /<repo>/ 底下，所以 build 時要帶上 base。
// 本機 dev 用 '/'，部署時由 npm script 的 BASE_PATH 覆寫。
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true }
});
