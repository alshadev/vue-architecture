<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AuthLayout from '@/layout/AuthLayout.vue'
import BaseCard from '@/core/components/base/BaseCard.vue'
import BaseInput from '@/core/components/base/BaseInput.vue'
import BaseButton from '@/core/components/base/BaseButton.vue'
import Icon from '@/core/components/icons/Icon.vue'
import { useLogin } from '../composables/useLogin'

const { t } = useI18n()
const { email, password, rememberMe, error, isLoading, login } = useLogin()

const handleSubmit = () => {
  login()
}
</script>

<template>
  <AuthLayout>
    <BaseCard variant="glass" padding="lg">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-100">
          {{ t('auth.welcome') }}
        </h2>
        <p class="mt-2 text-surface-600 dark:text-surface-400">
          {{ t('auth.subtitle') }}
        </p>
      </div>

      <!-- Error message -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="error"
          class="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Icon name="alertCircle" size="sm" />
            <span class="text-sm font-medium">{{ error }}</span>
          </div>
        </div>
      </Transition>

      <!-- Login form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <BaseInput
          v-model="email"
          type="email"
          :label="t('auth.email')"
          :placeholder="t('auth.emailPlaceholder')"
          icon="mail"
          required
        />

        <BaseInput
          v-model="password"
          type="password"
          :label="t('auth.password')"
          :placeholder="t('auth.passwordPlaceholder')"
          icon="lock"
          required
        />

        <!-- Remember me & Forgot password -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-surface-300 dark:border-surface-600 text-primary-500 focus:ring-primary-500 dark:bg-surface-700"
            />
            <span class="text-sm text-surface-600 dark:text-surface-400">
              {{ t('auth.rememberMe') }}
            </span>
          </label>
          <a
            href="#"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            {{ t('auth.forgotPassword') }}
          </a>
        </div>

        <!-- Submit button -->
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isLoading"
          full-width
        >
          {{ isLoading ? t('auth.loggingIn') : t('auth.loginButton') }}
        </BaseButton>
      </form>
    </BaseCard>
  </AuthLayout>
</template>
