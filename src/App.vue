<script setup lang="ts">
import { onMounted } from 'vue'
import { useLanguage } from '@/core/composables/useLanguage'

// Theme auto-initializes on import, so we just need to import it
import '@/core/composables/useTheme'

// Initialize language on app mount
const { initLocale } = useLanguage()

onMounted(() => {
  initLocale()
})
</script>

<template>
  <RouterView />
</template>
