<script setup lang="ts">
import { useTheme } from '@/core/composables/useTheme'
import Icon from '@/core/components/icons/Icon.vue'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative p-2 rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-700 transition-all duration-200"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 rotate-90 scale-0"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 -rotate-90 scale-0"
    >
      <Icon v-if="isDark" key="moon" name="moon" size="md" />
      <Icon v-else key="sun" name="sun" size="md" />
    </Transition>
  </button>
</template>
