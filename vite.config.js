import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Environment variables configuration
  envPrefix: 'VITE_',
  
  // Development server configuration
  server: {
    port: 3000,
    host: true, // Allow external connections for mobile testing
    open: true, // Auto-open browser
  },
  
  // Build optimization for plant health app
  build: {
    // Optimize for modern browsers
    target: 'es2015',
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          'vendor': ['react', 'react-dom'],
          'ai-apis': ['@google/generative-ai'],
          'ui': ['@headlessui/react', '@heroicons/react'],
        },
      },
    },
    
    // Source maps for debugging in production (remove for final deploy)
    sourcemap: true,
  },
  
  // Asset handling
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp'],
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@google/generative-ai',
      '@headlessui/react',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
    ],
  },
  
  // Preview server (for testing production builds)
  preview: {
    port: 4173,
    host: true,
  },
  
  // Define global constants (useful for API endpoints)
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})