<script setup lang="ts">
interface Props {
  variant?: 'default' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hover: false
})

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}
</script>

<template>
  <div
    :class="[
      'rounded-xl transition-all duration-200',
      props.variant === 'glass'
        ? 'bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border border-white/20 dark:border-surface-700/50'
        : 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700',
      'shadow-sm',
      paddingClasses[props.padding],
      props.hover && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
    ]"
  >
    <slot />
  </div>
</template>
