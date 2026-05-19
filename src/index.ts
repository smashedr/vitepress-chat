import { h } from 'vue'
import ChatButton from './ChatButton.vue'

export { ChatButton }

export interface ChatOptions {
  /** API endpoint URL for the chat transport */
  api: string
  /** Additional headers to send with chat requests */
  headers?: Record<string, string>
}

export default function VitePressChat(theme: any, options: ChatOptions) {
  return {
    Layout: () =>
      h(theme.Layout, null, {
        'layout-bottom': () => h(ChatButton, options),
      }),
  }
}
