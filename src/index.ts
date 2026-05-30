import { h } from 'vue'
import ChatButton from './ChatButton.vue'

export { ChatButton }

export interface ChatOptions {
  api: string
  headers?: Record<string, string>
  instructionsFile?: string
}

export default function VitePressChat(theme: any, options: ChatOptions) {
  return {
    Layout: () =>
      h(theme.Layout, null, {
        'layout-bottom': () => h(ChatButton, options),
      }),
  }
}
