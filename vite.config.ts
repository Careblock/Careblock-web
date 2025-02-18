import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react';
import wasmPlugin from 'vite-plugin-wasm';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasmPlugin(), nodePolyfills()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    build: {
        target: 'esnext',
    },
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    server: {
        port: process.env.PORT as unknown as number,
    },
    plugins: [vercel()],
});
