<script setup lang="ts">
import { icons, type IconName } from './icons'

interface Props {
  name: IconName
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClasses: Record<string, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}
</script>

<template>
  <span
    class="inline-flex items-center justify-center shrink-0"
    :class="sizeClasses[props.size]"
    v-html="icons[props.name]"
    aria-hidden="true"
  />
</template>

<style scoped>
span :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
