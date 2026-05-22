<script lang="ts" setup>
import { onBeforeUnmount, shallowRef, watch } from 'vue'
import { useScrollLock, useEventListener, onKeyStroke } from '@vueuse/core'

const props = defineProps<{
  visible?: boolean
}>()

const emit = defineEmits(['close'])

const el = shallowRef<HTMLElement>()

const isLocked = useScrollLock(typeof window !== 'undefined' ? document.body : null)

watch(
  () => props.visible,
  (val) => {
    isLocked.value = val
    if (val) window.history.pushState(null, '', null)
  },
)

onKeyStroke('Escape', () => {
  if (props.visible) {
    emit('close')
  }
})

useEventListener('popstate', (event) => {
  if (props.visible) {
    event.preventDefault()
    emit('close')
  }
})

onBeforeUnmount(() => {
  isLocked.value = false
})
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-chat">
      <div v-if="visible" ref="el" class="VPChatBox">
        <!-- Clicking the backdrop closes the modal, same as VitePress -->
        <div class="backdrop" @click="$emit('close')" />

        <div class="shell">
          <!-- Close button in the top-right corner -->
          <button class="close-button" title="Close chat" @click="$emit('close')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Drop your chat UI in here via the default slot -->
          <slot>
            <div class="chat-placeholder">
              <p>Your chat component goes here.</p>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ─── Overlay wrapper ─────────────────────────────────────── */
.VPChatBox {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
}

/* ─── Backdrop ────────────────────────────────────────────── */
.backdrop {
  position: absolute;
  inset: 0;
  background: var(--vp-backdrop-bg-color);
  /*background: var(--docsearch-container-background);*/
  transition: opacity 0.5s;
}

/* ─── Modal shell ─────────────────────────────────────────── */
.shell {
  position: relative;
  margin: 64px auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--vp-local-search-bg);
  width: min(100vw - 90px, 900px);
  height: min(100vh - 128px);
  border-radius: 6px;
  overflow: hidden;
}

@media (max-width: 767px) {
  .shell {
    margin: 0;
    width: 100vw;
    height: 100dvh;
    max-height: none;
    border-radius: 0;
  }
}

/* ─── Close button ────────────────────────────────────────── */
.close-button {
  position: absolute;
  top: 2px;
  right: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  transition:
    color 0.2s,
    background-color 0.2s;
}

.close-button:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

/* ─── Placeholder (remove once you add your chat slot) ───── */
.chat-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

/* ─── Transition ──────────────────────────────────────────── */
.vp-chat-enter-active,
.vp-chat-leave-active {
  transition: opacity 0.2s ease;
}

.vp-chat-enter-from,
.vp-chat-leave-to {
  opacity: 0;
}

.vp-chat-enter-active .shell,
.vp-chat-leave-active .shell {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.vp-chat-enter-from .shell,
.vp-chat-leave-to .shell {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
