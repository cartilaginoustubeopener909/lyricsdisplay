import path from 'node:path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
            '@lyricsdisplay/shared': path.join(__dirname, '../../packages/shared/src')
        },
    },

    plugins: [
        react(),
    ],

    clearScreen: false,
    server: {
        port: 7777,
        strictPort: true,
        host: process.env.TAURI_DEV_HOST || false,
        hmr: process.env.TAURI_DEV_HOST
            ? {
                protocol: "ws",
                host: process.env.TAURI_DEV_HOST,
                port: 7778,
            }
            : undefined,
    },
}))
