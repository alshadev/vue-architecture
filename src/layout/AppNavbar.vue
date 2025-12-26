<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Icon from '@/core/components/icons/Icon.vue'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LanguageSelector from '@/core/components/LanguageSelector.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const emit = defineEmits<{
  'toggle-sidebar': []
}>()

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()

const isUserMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleLogout = async () => {
  isUserMenuOpen.value = false
  await authStore.logout()
  router.push('/login')
}

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="h-16 flex items-center justify-between px-4 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
    <!-- Left side -->
    <div class="flex items-center gap-4">
      <!-- Mobile menu button -->
      <button
        type="button"
        class="lg:hidden p-2 rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-100 dark:hover:bg-surface-700 transition-colors"
        @click="emit('toggle-sidebar')"
      >
        <Icon name="menu" size="md" />
      </button>

      <!-- Page title from route meta -->
      <h1 class="text-lg font-semibold text-surface-900 dark:text-surface-100 hidden sm:block">
        {{ route.meta?.title || 'Vue Admin' }}
      </h1>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-2">
      <ThemeToggle />
      <LanguageSelector />

      <!-- User menu -->
      <div ref="userMenuRef" class="relative ml-2">
        <button
          type="button"
          class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          @click="toggleUserMenu"
        >
          <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </span>
          </div>
          <span class="hidden md:block text-sm font-medium text-surface-700 dark:text-surface-300">
            {{ authStore.user?.name || 'User' }}
          </span>
          <Icon
            name="chevronDown"
            size="xs"
            :class="['hidden md:block text-surface-500 transition-transform duration-200', { 'rotate-180': isUserMenuOpen }]"
          />
        </button>

        <!-- Dropdown menu -->
        <Transition
          enter-active-class="transition-all duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 -translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 -translate-y-1"
        >
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-56 py-1 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 z-50"
          >
            <!-- User info -->
            <div class="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
              <p class="text-sm font-medium text-surface-900 dark:text-surface-100">
                {{ authStore.user?.name || 'User' }}
              </p>
              <p class="text-xs text-surface-500 dark:text-surface-400 truncate">
                {{ authStore.user?.email || '' }}
              </p>
            </div>

            <!-- Menu items -->
            <div class="py-1">
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <Icon name="user" size="sm" />
                {{ t('user.profile') }}
              </button>
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <Icon name="settings" size="sm" />
                {{ t('user.settings') }}
              </button>
            </div>

            <!-- Logout -->
            <div class="border-t border-surface-200 dark:border-surface-700 py-1">
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                @click="handleLogout"
              >
                <Icon name="logout" size="sm" />
                {{ t('user.logout') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
