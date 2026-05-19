import DefaultTheme, { VPBadge } from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

import VitePressChat from '../../../src/index'

// noinspection JSUnusedGlobalSymbols
export default {
  ...DefaultTheme,
  ...VitePressChat(DefaultTheme, {
    api: import.meta.env.VITE_AI_API,
    // headers: { Authorization: import.meta.env.VITE_AI_AUTH },
    headers: import.meta.env.VITE_AI_AUTH
      ? { Authorization: import.meta.env.VITE_AI_AUTH }
      : undefined,
  }),

  enhanceApp({ app }) {
    // eslint-disable-next-line vue/multi-word-component-names
    app.component('Badge', VPBadge)
  },
} satisfies Theme
