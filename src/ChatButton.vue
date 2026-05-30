<script setup lang="ts">
import { computed, ref, watch, nextTick, useTemplateRef, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
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
const error = ref('')
const messagesEl = useTemplateRef('messagesEl')
const anchorEl = useTemplateRef('anchorEl')
const inputEl = useTemplateRef('inputEl')

const { site } = useData()
const base = site.value.base || '/'
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
  const instructionsPath = `${base}${props.instructionsFile ?? 'instructions.txt'}`
  console.log('instructionsPath:', instructionsPath)
  try {
    if (import.meta.env.VITE_AI_DEV_INSTRUCTIONS) {
      instructions.value = import.meta.env.VITE_AI_DEV_INSTRUCTIONS
      return console.log('DEV instructions:', instructions.value)
    }
    const res = await fetch(instructionsPath)
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
  onError: (e) => {
    console.error(e)
    error.value = e.message
  },
})

const chatBusy = computed(() => chat.status !== 'ready' && chat.status !== 'error')

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

function onTextareaKeydown(e: KeyboardEvent) {
  // allow enter to send and ctrl/shift/meta+enter to make newline
  if (e.key !== 'Enter') return
  e.preventDefault()
  if (e.shiftKey || e.ctrlKey || e.metaKey) {
    const el = inputEl.value
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const val = input.value
    input.value = val.slice(0, start) + '\n' + val.slice(end)
    nextTick(() => {
      el.selectionStart = el.selectionEnd = start + 1
    })
  } else {
    handleSubmit(e)
  }
}

function handleSubmit(e: Event) {
  e.preventDefault()
  const text = input.value.trim()
  if (!text) return
  scrollToBottom()
  error.value = ''
  chat.sendMessage({ text })
  input.value = ''
  focusInput()
}
</script>

<template>
  <button class="vp-chat-button" title="Open chat" @click="isOpen = true">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      />
    </svg>
    AI Chat
  </button>

  <VPChatBox :visible="isOpen" @close="isOpen = false">
    <div class="chat-layout">
      <!-- ── Messages ───────────────────────────────────────── -->
      <div ref="messagesEl" class="chat-messages" @scroll="onScroll">
        <div v-if="chat.messages.length === 0" class="chat-empty">
          <p>Ask Anything</p>
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
              <span v-if="part.type === 'text'" v-html="renderMarkdown(part.text)" />
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

      <hr class="chat-divider" />

      <!-- ── Error banner ──────────────────────────────────── -->
      <div v-if="error" class="chat-error">{{ error }}</div>

      <!-- ── Input bar ──────────────────────────────────────── -->
      <form class="chat-form" @submit="handleSubmit">
        <textarea
          ref="inputEl"
          v-model="input"
          class="chat-input"
          :disabled="chatBusy"
          placeholder="Enter your question (use Ctrl/Shift+Enter for new lines)…"
          autocomplete="off"
          @keydown="onTextareaKeydown"
        />
        <button type="submit" class="chat-send" :disabled="chatBusy || !input.trim()" title="Send">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
  bottom: 32px;
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
  padding-top: 22px;
  gap: 8px;
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
  color: var(--vp-c-text-2);
  opacity: 0.8;
  font-size: 1.6rem;
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
  background: var(--vp-c-default-2);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border);
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

/* ─── Error banner ────────────────────────────────────────── */
.chat-error {
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger-2);
  color: var(--vp-c-danger-1);
  font-size: 0.85rem;
  line-height: 1.4;
  word-break: break-word;
}

/* ─── Divider ──────────────────────────────────────────────── */
.chat-divider {
  flex-shrink: 0;
  margin: 0;
  border: none;
  border-top: 1px solid var(--vp-c-divider);
}

/* ─── Input bar ───────────────────────────────────────────── */
.chat-form {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
}

.chat-input {
  flex: 1;
  min-width: 0;
  padding: 8px 44px 8px 8px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.4;
  outline: none;
  transition: border-color 0.2s;
  height: 80px;
  min-height: 50px;
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
  position: absolute;
  top: 6px;
  right: 6px;
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
