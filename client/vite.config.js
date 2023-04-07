import { resolve } from 'path';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

dotenv.config({
    path: resolve(__dirname + '/../.env'),
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: process.env.FRONTEND_PORT,
    },
    envDir: './..',
});
