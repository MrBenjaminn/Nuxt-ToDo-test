import { defineVitestConfig } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default defineVitestConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'pinia'],
    }),
  ],
  define: {
    'import.meta.client': true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'nuxt',
  },
})
