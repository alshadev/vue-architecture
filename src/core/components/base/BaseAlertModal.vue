<script setup lang="ts">
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import Icon from '@/core/components/icons/Icon.vue'
import type { IconName } from '@/core/components/icons/icons'

type AlertType = 'success' | 'warning' | 'info' | 'danger'

interface Props {
  modelValue: boolean
  type?: AlertType
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  showCancel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false,
  showCancel: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

const iconName = computed<IconName>(() => {
  switch (props.type) {
    case 'success': return 'checkCircle'
    case 'warning': return 'warning'
    case 'danger': return 'alertCircle'
    case 'info':
    default: return 'info'
  }
})

const colorClass = computed(() => {
  switch (props.type) {
    case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'danger': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
    case 'info':
    default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
  }
})

const confirmButtonVariant = computed(() => {
  switch (props.type) {
    case 'danger': return 'danger'
    case 'warning': return 'warning'
    case 'success': return 'success' // Assuming BaseButton supports 'success', otherwise 'primary'
    default: return 'primary'
  }
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    size="sm"
    :closable="!showCancel && !loading"
    :close-on-backdrop="!loading"
    :close-on-escape="!loading"
  >
    <div class="flex flex-col items-center text-center p-2">
      <!-- Icon -->
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors"
        :class="colorClass"
      >
        <Icon :name="iconName" size="lg" />
      </div>

      <!-- Content -->
      <h3 class="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">
        {{ title }}
      </h3>
      <p class="text-surface-500 dark:text-surface-400 mb-6">
        {{ message }}
      </p>

      <!-- Actions -->
      <div class="flex items-center justify-center gap-3 w-full">
        <BaseButton
          v-if="showCancel"
          variant="ghost"
          :disabled="loading"
          @click="handleCancel"
          class="w-full justify-center"
        >
          {{ cancelText }}
        </BaseButton>
        <BaseButton
          :variant="confirmButtonVariant"
          :loading="loading"
          @click="handleConfirm"
          class="w-full justify-center"
        >
          {{ confirmText }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
