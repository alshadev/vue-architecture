<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppNavbar from './AppNavbar.vue'
import Icon from '@/core/components/icons/Icon.vue'

const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const isMobile = ref(false)

const toggleSidebarCollapse = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isMobileSidebarOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="h-screen flex bg-surface-50 dark:bg-surface-900 overflow-hidden">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:block flex-shrink-0">
      <AppSidebar
        :collapsed="isSidebarCollapsed"
        @toggle-collapse="toggleSidebarCollapse"
      />
    </div>

    <!-- Mobile Sidebar Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileSidebarOpen"
        class="fixed inset-0 z-40 lg:hidden"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="toggleMobileSidebar"
        />

        <!-- Sidebar drawer -->
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-200 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
          appear
        >
          <div class="absolute inset-y-0 left-0 w-[260px] flex">
            <AppSidebar :collapsed="false" />
            
            <!-- Close button -->
            <button
              type="button"
              class="absolute top-4 right-[-48px] p-2 rounded-lg bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 shadow-lg"
              @click="toggleMobileSidebar"
            >
              <Icon name="close" size="md" />
            </button>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Main content area -->
    <div class="flex-1 flex flex-col min-w-0">
      <AppNavbar @toggle-sidebar="toggleMobileSidebar" />

      <main class="flex-1 p-4 md:p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
