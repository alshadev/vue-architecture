<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import Icon from '@/core/components/icons/Icon.vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
}

const close = () => {
  if (props.closable) {
    emit('update:modelValue', false)
  }
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.modelValue) {
    close()
  }
}

// Lock body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="props.modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="handleBackdropClick"
        />

        <!-- Modal content -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="props.modelValue"
            :class="[
              'relative w-full bg-white dark:bg-surface-800 rounded-xl shadow-xl',
              sizeClasses[props.size]
            ]"
          >
            <!-- Header -->
            <div
              v-if="props.title || props.closable"
              class="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700"
            >
              <h3
                v-if="props.title"
                class="text-lg font-semibold text-surface-900 dark:text-surface-100"
              >
                {{ props.title }}
              </h3>
              <button
                v-if="props.closable"
                type="button"
                class="p-1 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:text-surface-300 dark:hover:bg-surface-700 transition-colors"
                @click="close"
              >
                <Icon name="close" size="md" />
              </button>
            </div>

            <!-- Body -->
            <div class="p-4">
              <slot />
            </div>

            <!-- Footer slot -->
            <div
              v-if="$slots.footer"
              class="p-4 border-t border-surface-200 dark:border-surface-700"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
