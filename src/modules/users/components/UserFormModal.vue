<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseModal from '@/core/components/base/BaseModal.vue'
import BaseInput from '@/core/components/base/BaseInput.vue'
import BaseButton from '@/core/components/base/BaseButton.vue'
import type { CreateUserDto, UpdateUserDto, User } from '../types'

interface Props {
  modelValue: boolean
  user?: User | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  user: null,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: CreateUserDto | UpdateUserDto]
}>()

const form = ref<CreateUserDto>({
  name: '',
  email: '',
  role: 'viewer',
  status: 'active'
})

const isEdit = computed(() => !!props.user)

watch(() => props.user, (newUser) => {
  if (newUser) {
    form.value = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status
    }
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen && !props.user) {
    resetForm()
  }
})

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    role: 'viewer',
    status: 'active'
  }
}

const handleSubmit = () => {
  emit('submit', form.value)
}

const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="isEdit ? 'Edit User' : 'Add New User'"
    @update:model-value="close"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <BaseInput
        v-model="form.name"
        label="Full Name"
        placeholder="Enter full name"
        required
      />
      
      <BaseInput
        v-model="form.email"
        type="email"
        label="Email Address"
        placeholder="Enter email address"
        required
      />

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300">
            Role
          </label>
          <select
            v-model="form.role"
            class="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-surface-700 dark:text-surface-300">
            Status
          </label>
          <select
            v-model="form.status"
            class="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    </form>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton
          variant="ghost"
          @click="close"
        >
          Cancel
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="loading"
          @click.prevent="handleSubmit"
        >
          {{ isEdit ? 'Update User' : 'Create User' }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
