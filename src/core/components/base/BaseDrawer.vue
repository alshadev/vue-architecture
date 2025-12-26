<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import Icon from '@/core/components/icons/Icon.vue'

interface Props {
  modelValue: boolean
  title?: string
  width?: string
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  width: '400px',
  persistent: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (!props.persistent) {
    close()
  }
}

// Prevent body scroll when drawer is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex justify-end"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          @click="handleBackdropClick"
        />

        <!-- Scanner Panel -->
        <Transition
          enter-active-class="transition transform duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition transform duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
          appear
        >
          <div
            class="relative w-full h-full bg-white dark:bg-surface-800 shadow-xl flex flex-col border-l border-surface-200 dark:border-surface-700"
            :style="{ maxWidth: width }"
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
                {{ title }}
              </h3>
              <button
                type="button"
                class="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
                @click="close"
              >
                <Icon name="close" size="md" />
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
