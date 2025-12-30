<script setup lang="ts">
import Icon from '@/core/components/icons/Icon.vue'
import type { IconName } from '@/core/components/icons/icons'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: IconName
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  fullWidth: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-surface-100 hover:bg-surface-200 text-surface-800 dark:bg-surface-700 dark:hover:bg-surface-600 dark:text-surface-100',
  ghost: 'bg-transparent hover:bg-surface-100 text-surface-700 dark:hover:bg-surface-800 dark:text-surface-300',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md',
  outline: 'bg-transparent border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800',
  success: 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm hover:shadow-md'
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg cursor-pointer',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'dark:focus:ring-offset-surface-900',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
      variantClasses[props.variant],
      sizeClasses[props.size],
      { 'w-full': props.fullWidth }
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <Icon
      v-if="props.loading"
      name="loader"
      :size="props.size === 'lg' ? 'md' : 'sm'"
      class="animate-spin"
    />
    
    <!-- Left icon -->
    <Icon
      v-else-if="props.icon && props.iconPosition === 'left'"
      :name="props.icon"
      :size="props.size === 'lg' ? 'md' : 'sm'"
    />
    
    <!-- Slot content -->
    <span>
      <slot />
    </span>
    
    <!-- Right icon -->
    <Icon
      v-if="props.icon && props.iconPosition === 'right' && !props.loading"
      :name="props.icon"
      :size="props.size === 'lg' ? 'md' : 'sm'"
    />
  </button>
</template>
