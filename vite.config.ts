import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  // sockjs-client references Node.js `global` which doesn't exist in browsers.
  // This replaces every occurrence of `global` with `globalThis` at build time.
  define: {
    global: 'globalThis',
  },
  server: {
    host: true,
    https: {},
    port: 5173,
  },
});
