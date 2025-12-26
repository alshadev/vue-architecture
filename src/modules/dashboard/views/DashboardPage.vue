<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppLayout from '@/layout/AppLayout.vue'
import BaseCard from '@/core/components/base/BaseCard.vue'
import Icon from '@/core/components/icons/Icon.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const { t } = useI18n()
const authStore = useAuthStore()

// Mock stats data
const stats = [
  { key: 'users', label: 'dashboard.totalUsers', value: '12,456', icon: 'users', color: 'primary', change: '+12%' },
  { key: 'revenue', label: 'dashboard.totalRevenue', value: '$54,239', icon: 'dollarSign', color: 'green', change: '+8%' },
  { key: 'projects', label: 'dashboard.activeProjects', value: '24', icon: 'briefcase', color: 'blue', change: '+3' },
  { key: 'tasks', label: 'dashboard.completedTasks', value: '1,429', icon: 'checkCircle', color: 'purple', change: '+156' }
]

const getIconBgClass = (color: string) => {
  const classes: Record<string, string> = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
  }
  return classes[color] || classes.primary
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Welcome header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-surface-900 dark:text-surface-100">
          {{ t('dashboard.welcomeMessage', { name: authStore.user?.name || 'User' }) }}
        </h1>
        <p class="mt-1 text-surface-600 dark:text-surface-400">
          {{ t('dashboard.subtitle') }}
        </p>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <BaseCard
          v-for="stat in stats"
          :key="stat.key"
          hover
          class="animate-fade-in"
        >
          <div class="flex items-center gap-4">
            <div
              :class="[
                'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                getIconBgClass(stat.color)
              ]"
            >
              <Icon :name="stat.icon as any" size="lg" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-surface-500 dark:text-surface-400 truncate">
                {{ t(stat.label) }}
              </p>
              <div class="flex items-baseline gap-2">
                <p class="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {{ stat.value }}
                </p>
                <span class="text-xs font-medium text-green-500 flex items-center gap-0.5">
                  <Icon name="trendingUp" size="xs" />
                  {{ stat.change }}
                </span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Placeholder content cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Main content area -->
        <BaseCard class="lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Overview
            </h2>
            <Icon name="barChart" size="md" class="text-surface-400" />
          </div>
          <div class="h-64 flex items-center justify-center bg-surface-50 dark:bg-surface-700/50 rounded-lg border-2 border-dashed border-surface-200 dark:border-surface-600">
            <p class="text-surface-500 dark:text-surface-400">
              Chart component placeholder
            </p>
          </div>
        </BaseCard>

        <!-- Side panel -->
        <BaseCard>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-100">
              Recent Activity
            </h2>
          </div>
          <div class="space-y-4">
            <div
              v-for="i in 4"
              :key="i"
              class="flex items-center gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50"
            >
              <div class="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center">
                <span class="text-xs font-medium text-surface-600 dark:text-surface-300">{{ i }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-surface-700 dark:text-surface-300 truncate">
                  Activity item {{ i }}
                </p>
                <p class="text-xs text-surface-500 dark:text-surface-400">
                  {{ i }} hour{{ i > 1 ? 's' : '' }} ago
                </p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </AppLayout>
</template>
