import { ref, watch } from 'vue'
import type { ThemeMode } from '@/core/types'

const STORAGE_KEY = 'theme_mode'

// Global reactive state - shared across all components
const currentTheme = ref<ThemeMode>('system')
const isDark = ref(false)
let isInitialized = false

/**
 * Get system preference
 */
const getSystemPreference = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Apply theme to document
 */
const applyTheme = (dark: boolean) => {
    isDark.value = dark

    if (typeof document !== 'undefined') {
        if (dark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }
}

/**
 * Update theme based on current mode
 */
const updateTheme = () => {
    if (currentTheme.value === 'system') {
        applyTheme(getSystemPreference())
    } else {
        applyTheme(currentTheme.value === 'dark')
    }
}

/**
 * Initialize theme from storage or system preference
 * Safe to call multiple times - will only initialize once
 */
const initTheme = () => {
    if (isInitialized) return
    isInitialized = true

    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null

    if (stored && ['light', 'dark', 'system'].includes(stored)) {
        currentTheme.value = stored
    }

    updateTheme()

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (currentTheme.value === 'system') {
            applyTheme(e.matches)
        }
    })
}

// Watch for theme changes
watch(currentTheme, updateTheme)

// Auto-initialize immediately if in browser
if (typeof window !== 'undefined') {
    initTheme()
}

/**
 * Theme management composable
 * Handles dark/light mode with system preference detection and persistence
 */
export function useTheme() {
    /**
     * Set theme mode
     */
    const setTheme = (mode: ThemeMode) => {
        currentTheme.value = mode
        localStorage.setItem(STORAGE_KEY, mode)
        updateTheme()
    }

    /**
     * Toggle between light and dark (skips system)
     */
    const toggleTheme = () => {
        const newMode = isDark.value ? 'light' : 'dark'
        setTheme(newMode)
    }

    return {
        currentTheme,
        isDark,
        setTheme,
        toggleTheme,
        initTheme
    }
}
