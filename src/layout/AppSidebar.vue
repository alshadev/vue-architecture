<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Icon from '@/core/components/icons/Icon.vue'
import { menuGroups } from '@/router/navigation'
import { useAuthStore } from '@/modules/auth/store/auth.store'

interface Props {
  collapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false
})

const emit = defineEmits<{
  'toggle-collapse': []
}>()

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()

const isActive = (path: string | undefined) => {
  if (!path) return false
  return route.path === path
}

const navigateTo = (path: string | undefined) => {
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <aside
    :class="[
      'h-full flex flex-col bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700',
      'transition-all duration-300 ease-in-out',
      props.collapsed ? 'w-[72px]' : 'w-[260px]'
    ]"
  >
    <!-- Logo - Smooth animation -->
    <div
      class="flex items-center h-16 border-b border-surface-200 dark:border-surface-700 px-4 overflow-hidden"
    >
      <div 
        class="flex items-center min-w-0 transition-all duration-300"
        :class="props.collapsed ? 'gap-0' : 'gap-3'"
      >
        <!-- Logo icon - always visible -->
        <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center transition-transform duration-300"
          :class="{ 'scale-90': props.collapsed }"
        >
          <span class="text-xl font-bold text-white">V</span>
        </div>
        
        <!-- Title - animate width and opacity -->
        <div
          class="overflow-hidden transition-all duration-300 ease-in-out"
          :class="props.collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
        >
          <span class="text-lg font-semibold text-surface-900 dark:text-surface-100 whitespace-nowrap">
            Vue Admin
          </span>
        </div>
      </div>
    </div>

    <!-- Navigation with Groups -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <div class="space-y-6 px-3">
        <!-- Iterate through groups -->
        <div v-for="group in menuGroups" :key="group.key">
          <!-- Group label (if present) -->
          <div
            v-if="group.label && !props.collapsed"
            class="px-3 mb-2 transition-all duration-300"
          >
            <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
              {{ t(group.label) }}
            </span>
          </div>
          
          <!-- Divider line when collapsed (for groups with labels) -->
          <div
            v-if="group.label && props.collapsed"
            class="mx-3 mb-2 border-t border-surface-200 dark:border-surface-700"
          />

          <!-- Group items -->
          <ul class="space-y-1">
            <li v-for="item in group.items" :key="item.key">
              <button
                type="button"
                :class="[
                  'w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive(item.route)
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100',
                  props.collapsed ? 'justify-center gap-0' : 'gap-3'
                ]"
                :title="props.collapsed ? t(item.label) : undefined"
                @click="navigateTo(item.route)"
              >
                <Icon :name="item.icon as any" size="md" class="flex-shrink-0" />
                
                <!-- Label - animate width and opacity -->
                <div
                  class="overflow-hidden transition-all duration-300 ease-in-out"
                  :class="props.collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
                >
                  <span class="text-sm font-medium whitespace-nowrap">
                    {{ t(item.label) }}
                  </span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- User info at bottom -->
    <div class="border-t border-surface-200 dark:border-surface-700 p-3">
      <div
        :class="[
          'flex items-center p-2 rounded-lg transition-all duration-300',
          props.collapsed ? 'justify-center gap-0' : 'gap-3'
        ]"
      >
        <!-- Avatar -->
        <div class="flex-shrink-0 w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
          </span>
        </div>
        
        <!-- User info - animate width and opacity -->
        <div
          class="flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out"
          :class="props.collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'"
        >
          <p class="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
            {{ authStore.user?.name || 'User' }}
          </p>
          <p class="text-xs text-surface-500 dark:text-surface-400 truncate">
            {{ authStore.user?.email || '' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Collapse toggle (desktop only) -->
    <div class="hidden lg:block border-t border-surface-200 dark:border-surface-700 p-3">
      <button
        type="button"
        class="w-full flex items-center justify-center p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:text-surface-300 dark:hover:bg-surface-700 transition-colors"
        @click="emit('toggle-collapse')"
      >
        <Icon
          :name="props.collapsed ? 'chevronRight' : 'chevronLeft'"
          size="md"
          class="transition-transform duration-300"
        />
      </button>
    </div>
  </aside>
</template>
