<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '@/core/components/icons/Icon.vue'
import type { IconName } from '@/core/components/icons/icons'

interface Props {
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  icon?: IconName
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="props.label"
      :for="inputId"
      class="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-red-500 ml-0.5">*</span>
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <!-- Left icon -->
      <div
        v-if="props.icon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <Icon
          :name="props.icon"
          size="sm"
          class="text-surface-400 dark:text-surface-500"
        />
      </div>

      <!-- Input field -->
      <input
        :id="inputId"
        :type="inputType"
        :value="props.modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :required="props.required"
        :class="[
          'block w-full rounded-lg border transition-all duration-200',
          'text-surface-900 dark:text-surface-100',
          'placeholder:text-surface-400 dark:placeholder:text-surface-500',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-100 dark:disabled:bg-surface-800',
          props.icon ? 'pl-10' : 'pl-4',
          props.type === 'password' ? 'pr-10' : 'pr-4',
          'py-2.5',
          props.error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-surface-300 dark:border-surface-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-800'
        ]"
        @input="handleInput"
      />

      <!-- Password toggle -->
      <button
        v-if="props.type === 'password'"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        @click="showPassword = !showPassword"
      >
        <Icon
          :name="showPassword ? 'eyeOff' : 'eye'"
          size="sm"
          class="text-surface-400 hover:text-surface-600 dark:text-surface-500 dark:hover:text-surface-300 transition-colors"
        />
      </button>
    </div>

    <!-- Error message -->
    <p v-if="props.error" class="mt-1.5 text-sm text-red-500 flex items-center gap-1">
      <Icon name="alertCircle" size="xs" />
      {{ props.error }}
    </p>

    <!-- Hint text -->
    <p v-else-if="props.hint" class="mt-1.5 text-sm text-surface-500 dark:text-surface-400">
      {{ props.hint }}
    </p>
  </div>
</template>
