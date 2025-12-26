<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/core/components/base/BaseInput.vue'
import BaseButton from '@/core/components/base/BaseButton.vue'
import Icon from '@/core/components/icons/Icon.vue'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LanguageSelector from '@/core/components/LanguageSelector.vue'
import { useLogin } from '../composables/useLogin'

const { t } = useI18n()
const { email, password, rememberMe, error, isLoading, login } = useLogin()

// Slider State
const currentSlide = ref(0)
const slides = computed(() => [
  {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
    title: t('app.login.slide1.title'),
    subtitle: t('app.login.slide1.subtitle')
  },
  {
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
    title: t('app.login.slide2.title'),
    subtitle: t('app.login.slide2.subtitle')
  },
  {
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
    title: t('app.login.slide3.title'),
    subtitle: t('app.login.slide3.subtitle')
  }
])

const currentSlideData = computed(() => slides.value[currentSlide.value] || slides.value[0])

let slideInterval: any

const startSlideShow = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
  }, 5000)
}

const setSlide = (index: number) => {
  currentSlide.value = index
  clearInterval(slideInterval)
  startSlideShow()
}

onMounted(() => {
  startSlideShow()
})

onUnmounted(() => {
  clearInterval(slideInterval)
})

const handleSubmit = () => {
  login()
}

const handleSocialLogin = (provider: string) => {
  console.log(`Login with ${provider}`)
  // Implement social login logic here
}
</script>

<template>
  <div class="h-screen w-full flex bg-surface-50 dark:bg-surface-900 transition-colors duration-300 overflow-hidden">
    <!-- Left Side - Image Slider (Hidden on mobile) -->
    <div class="hidden lg:relative w-1/2 overflow-hidden lg:flex flex-col justify-between p-8 m-4 rounded-3xl h-[calc(100vh-2rem)]">
      <!-- Background Images -->
      <div class="absolute inset-0 rounded-3xl overflow-hidden h-full">
        <TransitionGroup 
          name="fade" 
          tag="div" 
          class="relative w-full h-full"
        >
          <div
            v-for="(slide, index) in slides"
            :key="index"
            v-show="currentSlide === index"
            class="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out"
            :class="{ 'scale-105': currentSlide === index }"
            :style="{ backgroundImage: `url(${slide.image})` }"
          >
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          </div>
        </TransitionGroup>
      </div>
      
      <!-- Content Overlay -->
      <div class="relative z-10 flex justify-between items-center text-white">
        <div class="flex items-center gap-2">
           <div class="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
             <span class="font-bold">A</span>
           </div>
           <span class="text-lg font-bold tracking-wide">{{ t('app.name') }}</span>
        </div>
      </div>

      <div class="relative z-10 mt-auto">
        <div class="mb-8 overflow-hidden">
          <TransitionGroup 
             enter-active-class="transition-all duration-500 ease-out delay-100"
             enter-from-class="opacity-0 translate-y-4"
             enter-to-class="opacity-100 translate-y-0"
             leave-active-class="transition-all duration-300 ease-in absolute"
             leave-from-class="opacity-100 translate-y-0"
             leave-to-class="opacity-0 -translate-y-4"
          >
             <div :key="currentSlide" v-if="currentSlideData">
                <h1 class="text-4xl font-bold text-white mb-2 leading-tight">
                  {{ currentSlideData.title }},<br/>
                  {{ currentSlideData.subtitle }}
                </h1>
             </div>
          </TransitionGroup>
        </div>

        <!-- Slider Dots -->
        <div class="flex gap-2">
          <button
            v-for="(_, index) in slides"
            :key="index"
            @click="setSlide(index)"
            class="h-1 rounded-full transition-all duration-300"
            :class="currentSlide === index ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'"
          ></button>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto h-full">
      <!-- Top Controls -->
      <div class="absolute top-6 right-6 flex items-center gap-3">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      <div class="w-full max-w-md space-y-8">
        <div class="space-y-2">
          <h2 class="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
            {{ t('auth.welcome') }}
          </h2>
          <p class="text-surface-500 dark:text-surface-400">
            {{ t('app.login.noAccount') }} 
            <a href="#" class="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium">
              {{ t('app.login.signUp') }}
            </a>
          </p>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-4">
          <button
            type="button"
            class="flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors bg-white dark:bg-surface-800"
            @click="handleSocialLogin('google')"
          >
            <!-- Google Icon SVG -->
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ t('app.login.google') }}</span>
          </button>
          
          <button
            type="button"
            class="flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors bg-white dark:bg-surface-800"
            @click="handleSocialLogin('microsoft')"
          >
             <!-- Microsoft Icon SVG -->
            <svg class="w-5 h-5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z"/>
              <path fill="#81bc06" d="M12 1h10v10H12z"/>
              <path fill="#05a6f0" d="M1 12h10v10H1z"/>
              <path fill="#ffba08" d="M12 12h10v10H12z"/>
            </svg>
            <span class="text-sm font-medium text-surface-700 dark:text-surface-300">{{ t('app.login.microsoft') }}</span>
          </button>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-surface-200 dark:border-surface-700"></span>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-surface-50 dark:bg-surface-900 px-2 text-surface-500">{{ t('app.login.socialLogin') }}</span>
          </div>
        </div>

        <!-- Error Message -->
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
              class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium"
            >
              {{ error }}
            </div>
          </Transition>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-4">
            <BaseInput
              v-model="email"
              type="email"
              placeholder="Email address"
              icon="mail"
              required
              class="bg-white dark:bg-surface-800"
            />

             <BaseInput
              v-model="password"
              type="password"
              placeholder="Password"
              icon="lock"
              required
              class="bg-white dark:bg-surface-800"
            />
          </div>

          <div class="flex items-center justify-between mt-2">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <div class="relative flex items-center">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  class="peer h-5 w-5 rounded border-2 border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-offset-0 focus:ring-0 transition-all checked:bg-primary-600 checked:border-primary-600"
                />
                 <Icon name="check" size="xs" class="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span class="text-sm text-surface-600 dark:text-surface-400 font-medium">
                {{ t('auth.rememberMe') }}
              </span>
            </label>
            <a
              href="#"
              class="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500"
            >
              {{ t('auth.forgotPassword') }}
            </a>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            class="w-full !py-3 !text-base shadow-lg shadow-primary-500/20"
            :loading="isLoading"
          >
            {{ isLoading ? t('auth.loggingIn') : t('auth.loginButton') }}
          </BaseButton>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
