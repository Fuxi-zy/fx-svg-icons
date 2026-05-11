import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: (id) => {
        if (['vue', '@fuxishi/svg-icon', '@iconify/vue', 'antdv-next'].includes(id)) return true
        if (id.startsWith('node:')) return true
        return false
      },
      output: {
        globals: { vue: 'Vue' }
      }
    },
    cssCodeSplit: false
  }
})
