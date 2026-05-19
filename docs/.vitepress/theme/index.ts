import DefaultTheme, { VPBadge } from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

import VitePressChat from '../../../src/index'

// noinspection JSUnusedGlobalSymbols
export default {
  ...DefaultTheme,
  ...VitePressChat(DefaultTheme, {
    api: 'https://ai-chat.cssnr.com/',
    headers: { Authorization: 'Basic Y3NzbnI6cGFzc3dvcmQ=' },
  }),

  enhanceApp({ app }) {
    // eslint-disable-next-line vue/multi-word-component-names
    app.component('Badge', VPBadge)
  },
} satisfies Theme
