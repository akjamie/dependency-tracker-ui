import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080/dependency-tracker',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@emotion/react',
      '@emotion/styled',
      'hoist-non-react-statics',
      'react-toastify',
      'date-fns'
    ],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2020',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          'toastify': ['react-toastify'],
          'date-fns': ['date-fns']
        },
      }
    }
  },
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
      'hoist-non-react-statics': 'hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js'
    },
    dedupe: ['react', 'react-dom']
  },
}) 