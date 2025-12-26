<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import AppLayout from '@/layout/AppLayout.vue'
import BaseDataTable from '@/core/components/base/BaseDataTable.vue'
import BaseButton from '@/core/components/base/BaseButton.vue'
import BaseDrawer from '@/core/components/base/BaseDrawer.vue'
import BaseModal from '@/core/components/base/BaseModal.vue'
import BaseInput from '@/core/components/base/BaseInput.vue'
import Icon from '@/core/components/icons/Icon.vue'
import { useCrud } from '@/core/composables/useCrud'
import { userService } from '../services'
import type { User, CreateUserDto, UpdateUserDto, UserFilter } from '../types'

const tempFilters = ref<UserFilter>({
  role: '',
  status: ''
})

const {
  items: users,
  loading,
  pagination,
  filters,
  fetchItems,
  handlePageChange,
  handleSearch,
  handleFilterChange,
  createItem,
  updateItem,
  deleteItem
} = useCrud<User, CreateUserDto, UpdateUserDto, UserFilter>(userService, {
  search: '',
  role: '',
  status: ''
})

const openFilterDrawer = () => {
  tempFilters.value = { ...filters }
  isFilterDrawerOpen.value = true
}

const applyFilters = () => {
    handleFilterChange(tempFilters.value)
    isFilterDrawerOpen.value = false
}

const resetFilters = () => {
    tempFilters.value = { role: '', status: '' }
    handleFilterChange({ role: '', status: '' })
}

// Initial fetch
fetchItems()

// State
const isModalOpen = ref(false)
const isFilterDrawerOpen = ref(false)
const selectedUser = ref<User | null>(null)
const selectedRows = ref<User[]>([])

// Form State
const form = ref<CreateUserDto>({
  name: '',
  email: '',
  role: 'viewer',
  status: 'active'
})

// Watch for selected user changes to populate form
watch(selectedUser, (newUser) => {
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
})

// Reset form when modal closes
watch(isModalOpen, (isOpen) => {
  if (!isOpen && !selectedUser.value) {
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

const isEdit = computed(() => !!selectedUser.value)

// Table Columns
const columns = [
  { key: 'name', label: 'User', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'lastLogin', label: 'Last Login', sortable: true },
  { key: 'createdAt', label: 'Created At', sortable: true },
  { key: 'actions', label: 'Actions', align: 'right' as const, width: '100px' }
]

const handleCreate = () => {
  selectedUser.value = null
  isModalOpen.value = true
}

const handleEdit = (user: User) => {
  selectedUser.value = user
  isModalOpen.value = true
}

const handleDelete = async (user: User) => {
  if(confirm('Are you sure you want to delete this user?')) {
      await deleteItem(user.id)
  }
}

const handleBulkDelete = async () => {
  if(confirm(`Are you sure you want to delete ${selectedRows.value.length} users?`)) {
    // Determine if we need a bulk delete service method or just loop
    // For now, loop calls (inefficient but works for mock)
    // In real app, consider adding bulk delete endpoint
    for (const user of selectedRows.value) {
      await deleteItem(user.id)
    }
    selectedRows.value = []
  }
}

const handleFormSubmit = async () => {
  if (selectedUser.value) {
    await updateItem(selectedUser.value.id, form.value)
  } else {
    await createItem(form.value)
  }
  isModalOpen.value = false
}

const getRoleColor = (role: string) => {
  const map: Record<string, string> = {
    admin: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
    editor: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    viewer: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
  }
  return map[role] || map.viewer
}

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    active: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
    inactive: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
    pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
  }
  return map[status] || map.pending
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <AppLayout>
    <div class="flex flex-col h-full space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">Users</h1>
          <p class="text-surface-500 dark:text-surface-400 mt-1">Manage user access and permissions</p>
        </div>
        <BaseButton icon="plus" @click="handleCreate">Add User</BaseButton>
      </div>

      <div class="flex-1 min-h-0">
        <BaseDataTable
          :columns="columns"
          :data="users"
          :loading="loading"
          :pagination="pagination"
          v-model:selection="selectedRows"
          searchable
          @update:pagination="handlePageChange"
          @search="handleSearch"
        >
          <!-- Toolbar Slots -->
          <template #filters>
             <BaseButton
              variant="outline"
              icon="filter"
              @click="openFilterDrawer"
            >
              Filters
            </BaseButton>
          </template>

          <template #toolbar>
            <BaseButton
              v-if="selectedRows.length > 0"
              variant="danger"
              icon="trash"
              size="sm"
              @click="handleBulkDelete"
            >
              Delete ({{ selectedRows.length }})
            </BaseButton>
            <BaseButton
              variant="ghost"
              icon="refresh"
              size="sm"
              @click="fetchItems"
            />
          </template>

          <!-- Custom Cells -->
          <template #cell-name="{ row }">
            <div class="flex items-center gap-3">
              <img
                :src="row.avatar || `https://ui-avatars.com/api/?name=${row.name}&background=random`"
                class="w-8 h-8 rounded-full"
                alt="Avatar"
              />
              <div class="flex flex-col">
                <span class="font-medium text-surface-900 dark:text-surface-100">{{ row.name }}</span>
                <span class="text-xs text-surface-500">{{ row.email }}</span>
              </div>
            </div>
          </template>

          <template #cell-role="{ value }">
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
              :class="getRoleColor(value)"
            >
              {{ value }}
            </span>
          </template>

           <template #cell-status="{ value }">
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize inline-flex items-center gap-1.5"
              :class="getStatusColor(value)"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              {{ value }}
            </span>
          </template>

          <template #cell-lastLogin="{ value }">
            {{ formatDate(value) }}
          </template>
          
          <template #cell-createdAt="{ value }">
            {{ formatDate(value) }}
          </template>

          <template #cell-actions="{ row }">
            <div class="flex items-center justify-end gap-2">
              <button
                class="p-1.5 rounded-lg transition-colors text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Edit"
                :disabled="selectedRows.length > 0"
                @click.stop="handleEdit(row)"
              >
                <Icon name="edit" size="sm" />
              </button>
              <button
                class="p-1.5 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Delete"
                :disabled="selectedRows.length > 0"
                @click.stop="handleDelete(row)"
              >
                <Icon name="trash" size="sm" />
              </button>
            </div>
          </template>
          <template #empty>
            <div class="flex flex-col items-center gap-4 py-8">
              <div class="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <Icon name="users" size="lg" class="text-surface-400" />
              </div>
              <div class="text-center">
                <p class="text-lg font-medium text-surface-900 dark:text-surface-100">No users found</p>
                <p class="text-sm text-surface-500 dark:text-surface-400 mt-1">
                  Get started by creating a new user or adjusting your filters.
                </p>
              </div>
              <BaseButton icon="plus" @click="handleCreate">Add User</BaseButton>
            </div>
          </template>
        </BaseDataTable>
      </div>

      <!-- Advanced Filter Drawer -->
      <BaseDrawer
        v-model="isFilterDrawerOpen"
        title="Advanced Filters"
      >
        <div class="space-y-6">
          <div class="space-y-1.5">
            <label class="block text-sm font-medium text-surface-700 dark:text-surface-300">
              User Role
            </label>
            <select
              v-model="tempFilters.role"
              class="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none"
            >
              <option value="">All Roles</option>
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
              v-model="tempFilters.status"
              class="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
             <BaseButton
              variant="ghost"
              @click="resetFilters"
            >
              Reset
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="applyFilters"
            >
              Apply Filters
            </BaseButton>
          </div>
        </template>
      </BaseDrawer>

      <!-- User Form Modal -->
      <BaseModal
        v-model="isModalOpen"
        :title="isEdit ? 'Edit User' : 'Add New User'"
      >
        <form @submit.prevent="handleFormSubmit" class="space-y-4">
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
              @click="isModalOpen = false"
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              :loading="loading"
              @click.prevent="handleFormSubmit"
            >
              {{ isEdit ? 'Update User' : 'Create User' }}
            </BaseButton>
          </div>
        </template>
      </BaseModal>
    </div>
  </AppLayout>
</template>
