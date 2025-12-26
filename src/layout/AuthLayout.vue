<script setup lang="ts">
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LanguageSelector from '@/core/components/LanguageSelector.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900">
    <!-- Top right controls -->
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <ThemeToggle />
      <LanguageSelector />
    </div>

    <!-- Main content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo / Brand -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <span class="text-3xl font-bold text-white">V</span>
          </div>
          <h1 class="text-2xl font-bold text-white">Vue Admin</h1>
        </div>

        <!-- Content slot -->
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center text-white/60 text-sm">
      &copy; {{ new Date().getFullYear() }} Vue Admin. All rights reserved.
    </footer>
  </div>
</template>
