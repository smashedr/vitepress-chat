import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// const name = 'vitepress-chat'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        'vitepress-chat': path.resolve(__dirname, 'src/index.ts'),
        'instructions-plugin': path.resolve(__dirname, 'src/instructions-plugin.ts'),
      },
      name: 'VitePressChat',
      // fileName: (format) => `${name}.${format}.js`,
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ['es'], // skip UMD
    },
    // cssCodeSplit: true,
    rolldownOptions: {
      external: [
        'vue',
        'vitepress/theme',
        /^vitepress\/.*/,
        /^node:.*/,
        '@ai-sdk/vue',
        'ai',
        'highlight.js',
        'marked',
        'marked-highlight',
      ],
      // skip UMD
      // output: {
      //   globals: {
      //     vue: 'Vue',
      //     'vitepress/theme': 'VitePressDefaultTheme',
      //   },
      // },
    },
  },
})
