import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/storyaapp_frida/', 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
  }
});
