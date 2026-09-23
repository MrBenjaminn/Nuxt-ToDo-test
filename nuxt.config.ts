import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: [
    '@/assets/styles/_normalize.scss',
    '@/assets/styles/_fonts.scss',
    '@/assets/styles/global.scss',
  ],
  vite: {
    plugins: [svgLoader()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/variables.scss" as *;\n',
        },
      },
    },
  },
  modules: ['@pinia/nuxt'],
})
