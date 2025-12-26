<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage, availableLocales } from '@/core/composables/useLanguage'
import Icon from '@/core/components/icons/Icon.vue'
import type { Locale } from '@/core/types'

const { currentLocaleInfo, setLocale } = useLanguage()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLocale = (code: Locale) => {
  setLocale(code)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-700 transition-all duration-200"
      @click="toggleDropdown"
    >
      <span class="text-lg">{{ currentLocaleInfo.flag }}</span>
      <span class="text-sm font-medium hidden sm:inline">{{ currentLocaleInfo.code.toUpperCase() }}</span>
      <Icon
        name="chevronDown"
        size="xs"
        :class="['transition-transform duration-200', { 'rotate-180': isOpen }]"
      />
    </button>

    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-40 py-1 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 z-50"
      >
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          type="button"
          class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          :class="{ 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400': currentLocaleInfo.code === locale.code }"
          @click="selectLocale(locale.code)"
        >
          <span class="text-lg">{{ locale.flag }}</span>
          <span>{{ locale.name }}</span>
          <Icon
            v-if="currentLocaleInfo.code === locale.code"
            name="check"
            size="sm"
            class="ml-auto"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>
