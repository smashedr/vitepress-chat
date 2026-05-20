<script setup lang="ts">
import { ref, watch, nextTick, useTemplateRef, onMounted, onUnmounted } from 'vue'
import { DefaultChatTransport } from 'ai'
import { Chat } from '@ai-sdk/vue'
import type { ChatOptions } from './index'
import VPChatBox from './VPChatBox.vue'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const props = defineProps<ChatOptions>()

// if (!props.api) throw new Error('ChatButton - missing required prop: api')

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

const isOpen = ref(false)
const input = ref('')
const messagesEl = useTemplateRef('messagesEl')
const anchorEl = useTemplateRef('anchorEl')
const inputEl = useTemplateRef('inputEl')

const base = import.meta.env.BASE_URL || '/'
const system = `
You are a helpful assistant responding to questions in a chat box on a website.
MUST ALWAYS format ALL URLs (links) as Markdown links WITHOUT \`.md\` ending!
MUST also ALWAYS prepend the BASE "${base}" to the URL links!!
Example: [client](client.md) -> [client](${base}client)
VitePress Documentation Files:
`

const instructions = ref(system)

const renderMarkdown = (text: string) => marked.parse(text ?? '')

onMounted(async () => {
  // console.log('%c ON MOUNTED', 'color: SpringGreen')
  console.log('baseUrl:', base)
  try {
    const res = await fetch(`${base}instructions.txt`)
    console.log('res.status:', res.status)
    if (res.ok) {
      const text = await res.text()
      instructions.value = `${system}\n\n${text}`
      console.log('instructions:', instructions.value)
    } else {
      console.error('fetching instructions:', res)
    }
  } catch (e) {
    console.error('fetching instructions:', e)
  }
})

const chat = new Chat({
  transport: new DefaultChatTransport({
    api: props.api,
    ...(props.headers ? { headers: props.headers } : {}),
    body: () => ({ system: instructions.value }),
  }),
  onFinish: () => {
    scrollToBottom()
    focusInput()
  },
})

let autoScroll = true
let observer: MutationObserver | null = null

watch(messagesEl, (el) => {
  observer?.disconnect()
  if (!el) return
  observer = new MutationObserver(() => {
    if (autoScroll) anchorEl.value?.scrollIntoView({ block: 'end' })
  })
  observer.observe(el, { childList: true, subtree: true, characterData: true })
})

onUnmounted(() => observer?.disconnect())

// Release auto-scroll when user scrolls up; re-lock when back at bottom
function onScroll() {
  const el = messagesEl.value
  if (!el) return
  autoScroll = el.scrollHeight - el.scrollTop - el.clientHeight < 40
}

// Focus on open
watch(isOpen, (val) => {
  console.log('watch: %c isOpen', 'color: SpringGreen', val)
  if (val) {
    focusInput()
    nextTick(() => scrollToBottom())
  }
})

function onBubbleClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'A') {
    isOpen.value = false
  }
}

function focusInput() {
  console.log('focusInput:', !!inputEl.value)
  nextTick(() => inputEl.value?.focus())
}

function scrollToBottom() {
  autoScroll = true
  anchorEl.value?.scrollIntoView({ block: 'end' })
}

function handleSubmit(e: Event) {
  e.preventDefault()
  const text = input.value.trim()
  if (!text) return
  scrollToBottom()
  chat.sendMessage({ text })
  input.value = ''
  focusInput()
}
</script>

<template>
  <button class="vp-chat-button" title="Open chat" @click="isOpen = true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
    Chat
  </button>

  <VPChatBox v-if="isOpen" @close="isOpen = false">
    <div class="chat-layout">
      <!-- ── Messages ───────────────────────────────────────── -->
      <div ref="messagesEl" class="chat-messages" @scroll="onScroll">
        <div v-if="chat.messages.length === 0" class="chat-empty">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p>Ask me anything.</p>
        </div>

        <div
          v-for="message in chat.messages"
          :key="message.id"
          class="message"
          :class="message.role === 'user' ? 'message--user' : 'message--ai'"
        >
          <span class="message-label">
            {{ message.role === 'user' ? 'You' : 'AI' }}
          </span>
          <div class="message-bubble" @click="onBubbleClick">
            <span v-for="(part, i) in message.parts" :key="i">
              <span
                v-if="part.type === 'text'"
                v-html="message.role === 'user' ? part.text : renderMarkdown(part.text)"
              />
            </span>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="chat.status === 'submitted'" class="message message--ai">
          <div class="message-bubble--typing"><span class="dot" /><span class="dot" /><span class="dot" /></div>
        </div>

        <!-- Scroll sentinel: MutationObserver targets scrollIntoView here -->
        <div ref="anchorEl" />
      </div>

      <!-- ── Input bar ──────────────────────────────────────── -->
      <form class="chat-form" @submit="handleSubmit">
        <input
          ref="inputEl"
          v-model="input"
          class="chat-input"
          :disabled="chat.status !== 'ready'"
          placeholder="Message…"
          autocomplete="off"
        />
        <button type="submit" class="chat-send" :disabled="chat.status !== 'ready' || !input.trim()" title="Send">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  </VPChatBox>
</template>

<style scoped>
/* ─── Trigger button ──────────────────────────────────────── */
.vp-chat-button {
  position: fixed;
  bottom: 40px;
  right: 16px;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 24px;
  background: var(--vp-c-brand-2);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--vp-c-brand-2) 40%, transparent);
  transition:
    background-color 0.2s,
    box-shadow 0.2s,
    transform 0.15s;
}

.vp-chat-button:hover {
  background: var(--vp-c-brand-1);
  transform: scale(1.04);
}

.vp-chat-button:active {
  transform: translateY(0);
}

/* ─── Chat layout (fills the VPChatBox slot) ──────────────── */
/*
  VPChatBox .shell is:  display:flex; flex-direction:column; overflow:hidden
  This wrapper claims all remaining height via flex:1, then splits
  into a scrollable messages area + a fixed-height input bar.
*/
.chat-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; /* critical: lets flex children shrink past content height */
  padding-top: 20px;
}

/* ─── Messages area ───────────────────────────────────────── */
.chat-messages {
  flex: 1;
  min-height: 0; /* same trick: allows overflow-y to activate inside flex */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 2px 8px;
  /*scroll-behavior: smooth;*/
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}

/* ─── Empty state ─────────────────────────────────────────── */
.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--vp-c-text-3);
  opacity: 0.6;
  font-size: 0.9rem;
  user-select: none;
}
.chat-empty p {
  margin: 0;
}

/* ─── Message rows ────────────────────────────────────────── */
.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 96%;
}
.message--user {
  align-self: flex-end;
  align-items: flex-end;
}
.message--ai {
  align-self: flex-start;
  align-items: flex-start;
}

.message-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
  padding: 0 4px;
}

/* ─── Bubbles ─────────────────────────────────────────────── */
.message-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.9rem;
  line-height: 1.55;
  overflow-wrap: break-word;
  word-break: break-word;
  min-width: 0;
}

.message-bubble :deep(pre) {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
}

.message-bubble :deep(code) {
  word-break: break-word;
  overflow-wrap: break-word;
}

.message-bubble :deep(img) {
  max-width: 100%;
  height: auto;
}

.message--user .message-bubble {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message--ai .message-bubble {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-bottom-left-radius: 4px;
}

.message-bubble :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

/* ─── Typing indicator ────────────────────────────────────── */
.message-bubble--typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  animation: bounce 1.2s infinite ease-in-out;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

/* ─── Input bar ───────────────────────────────────────────── */
.chat-form {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  flex-shrink: 0; /* never let the form compress */
}

.chat-input {
  flex: 1;
  min-width: 0;
  padding: 9px 14px;
  border-radius: 22px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  line-height: 1.4;
  outline: none;
  transition: border-color 0.2s;
}
.chat-input::placeholder {
  color: var(--vp-c-text-3);
}
.chat-input:focus {
  border-color: var(--vp-c-brand-1);
}
.chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ─── Send button ─────────────────────────────────────────── */
.chat-send {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--vp-c-brand-2);
  color: #fff;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.15s,
    opacity 0.2s;
}
.chat-send:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  transform: scale(1.08);
}
.chat-send:active:not(:disabled) {
  transform: scale(0.96);
}
.chat-send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
