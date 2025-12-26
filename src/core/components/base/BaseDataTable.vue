<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/core/components/icons/Icon.vue'
import BaseButton from '@/core/components/base/BaseButton.vue'
import BaseInput from '@/core/components/base/BaseInput.vue'

export interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  pagination?: Pagination
  selection?: any[]
  searchable?: boolean
  searchPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: false,
  searchPlaceholder: 'Search...',
  pagination: () => ({ page: 1, limit: 10, total: 0 }),
  selection: () => []
})

const emit = defineEmits<{
  'update:selection': [value: any[]]
  'update:pagination': [value: Pagination]
  'sort': [column: string]
  'search': [value: string]
  'row-click': [row: any]
}>()

// Pagination logic
const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.limit))
const startItem = computed(() => ((props.pagination.page - 1) * props.pagination.limit) + 1)
const endItem = computed(() => Math.min(props.pagination.page * props.pagination.limit, props.pagination.total))

const handlePageChange = (page: number, limit?: number) => {
  if (page < 1 || page > totalPages.value && !limit) return
  emit('update:pagination', { 
    ...props.pagination, 
    page: limit ? 1 : page, // Reset to page 1 if limit changes
    limit: limit || props.pagination.limit 
  })
}

const handleSelectAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  emit('update:selection', checked ? [...props.data] : [])
}

const handleSelectRow = (row: any, checked: boolean) => {
  const newSelection = checked 
    ? [...props.selection, row]
    : props.selection.filter((i) => i !== row)
  emit('update:selection', newSelection)
}

const isSelected = (row: any) => props.selection.includes(row)
const isAllSelected = computed(() => props.data.length > 0 && props.selection.length === props.data.length)
const isIndeterminate = computed(() => props.selection.length > 0 && props.selection.length < props.data.length)

</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden">
    <!-- Toolbar -->
    <div v-if="$slots.toolbar || searchable" class="p-4 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-50/50 dark:bg-surface-800/50">
      <div class="w-full sm:w-auto flex-1 flex items-center gap-4">
        <!-- Search -->
        <div v-if="searchable" class="w-full sm:max-w-xs">
          <BaseInput
            type="search"
            :placeholder="searchPlaceholder"
            @update:model-value="(val) => emit('search', val as string)"
          >
            <template #prefix>
              <Icon name="search" size="sm" class="text-surface-400" />
            </template>
          </BaseInput>
        </div>
        <slot name="filters" />
      </div>
      
      <div class="flex items-center gap-3">
        <slot name="toolbar" />
      </div>
    </div>

    <!-- Table Container -->
    <div class="flex-1 overflow-auto relative">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 z-10 bg-white/80 dark:bg-surface-800/80 flex items-center justify-center backdrop-blur-[1px]">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm font-medium text-primary-600 dark:text-primary-400 animate-pulse">Loading data...</p>
        </div>
      </div>

      <table class="w-full text-left text-sm">
        <thead class="bg-surface-50 dark:bg-surface-700/50 sticky top-0 z-10">
          <tr>
            <!-- Selection Checkbox -->
            <th v-if="selection" class="w-12 px-4 py-3 border-b border-surface-200 dark:border-surface-700">
              <input 
                type="checkbox" 
                class="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500 dark:bg-surface-700"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="handleSelectAll"
              />
            </th>
            
            <th 
              v-for="col in columns" 
              :key="col.key"
              class="px-4 py-3 font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider text-xs border-b border-surface-200 dark:border-surface-700"
              :class="[
                col.sortable ? 'cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors select-none' : '',
                col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
              ]"
              :style="{ width: col.width }"
              @click="col.sortable && emit('sort', col.key)"
            >
              <div class="flex items-center gap-1" :class="{ 'justify-end': col.align === 'right', 'justify-center': col.align === 'center' }">
                {{ col.label }}
                <Icon v-if="col.sortable" name="chevronDown" size="xs" class="text-surface-400 opacity-0 group-hover:opacity-100" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100 dark:divide-surface-700/50">
          <tr 
            v-for="row in data" 
            :key="row.id || JSON.stringify(row)"
            class="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group"
            :class="{ 'bg-primary-50/30 dark:bg-primary-900/10': isSelected(row) }"
            @click="emit('row-click', row)"
          >
            <!-- Selection Checkbox -->
            <td v-if="selection" class="px-4 py-3" @click.stop>
              <input 
                type="checkbox" 
                class="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500 dark:bg-surface-700"
                :checked="isSelected(row)"
                @change="(e: any) => handleSelectRow(row, e.target.checked)"
              />
            </td>

            <td 
              v-for="col in columns" 
              :key="col.key"
              class="px-4 py-3 text-surface-600 dark:text-surface-300"
              :class="{ 'text-right': col.align === 'right', 'text-center': col.align === 'center' }"
            >
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          
          <!-- Empty State -->
          <tr v-if="data.length === 0 && !loading">
            <td :colspan="columns.length + (selection ? 1 : 0)" class="px-4 py-12 text-center text-surface-500 dark:text-surface-400">
              <slot name="empty">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                    <Icon name="search" size="lg" class="text-surface-400" />
                  </div>
                  <p class="font-medium">No results found</p>
                  <p class="text-xs">Try adjusting your filters or search terms.</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.total > 0" class="p-4 border-t border-surface-200 dark:border-surface-700 flex items-center justify-between bg-surface-50/50 dark:bg-surface-800/50">
      <p class="text-sm text-surface-500 dark:text-surface-400 hidden sm:block">
        Showing <span class="font-medium text-surface-900 dark:text-surface-200">{{ startItem }}</span> to <span class="font-medium text-surface-900 dark:text-surface-200">{{ endItem }}</span> of <span class="font-medium text-surface-900 dark:text-surface-200">{{ pagination.total }}</span> results
      </p>
      
      <div class="flex items-center gap-4">
        <!-- Rows per page -->
        <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
          <span>Rows per page:</span>
          <select 
            :value="pagination.limit" 
            @change="(e) => handlePageChange(pagination.page, Number((e.target as HTMLSelectElement).value))"
            class="bg-transparent border-none text-surface-900 dark:text-surface-200 font-medium focus:ring-0 cursor-pointer"
          >
            <option v-for="limit in [5, 10, 20, 50]" :key="limit" :value="limit">
              {{ limit }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <BaseButton 
            variant="outline" 
            size="sm" 
            :disabled="pagination.page === 1"
            @click="handlePageChange(pagination.page - 1)"
          >
            Previous
          </BaseButton>
          <div class="flex items-center gap-1">
            <button 
              v-for="p in Math.min(5, totalPages)" 
              :key="p"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="p === pagination.page 
                ? 'bg-primary-500 text-white font-medium shadow-sm' 
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'"
              @click="handlePageChange(p)"
            >
              {{ p }}
            </button>
          </div>
          <BaseButton 
            variant="outline" 
            size="sm" 
            :disabled="pagination.page === totalPages"
            @click="handlePageChange(pagination.page + 1)"
          >
            Next
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
