import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-virtual-types',
      writeBundle() {
        copyFileSync(resolve(__dirname, 'src/virtual.d.ts'), resolve(__dirname, 'dist/virtual.d.ts'))
      }
    }
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        vite: resolve(__dirname, 'src/vite-plugin.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'vite' && format === 'es'
          ? 'vite.mjs'
          : `${entryName}.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: (id) => {
        if (['vue', 'element-plus', '@element-plus/icons-vue', '@iconify/vue', 'naive-ui', 'antdv-next', '@antdv-next/icons', 'tdesign-vue-next', 'tdesign-icons-vue-next', 'vite'].includes(id)) return true
        if (id.startsWith('node:') || ['fs', 'path', 'module', 'url', 'os'].includes(id)) return true
        return false
      },
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@iconify/vue': 'IconifyVue',
          vite: 'Vite'
        }
      }
    },
    cssCodeSplit: false
  }
})
