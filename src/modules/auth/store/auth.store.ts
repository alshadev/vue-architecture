import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/core/types'
import { authService } from '../services/auth.service'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

/**
 * Authentication Store
 * Manages user state, JWT token, and authentication status
 */
export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isLoading = ref(false)

    // Getters
    const isAuthenticated = computed(() => !!token.value && authService.isTokenValid(token.value))

    // Actions

    /**
     * Set authentication data and persist to localStorage
     */
    function setAuth(newToken: string, newUser: User) {
        token.value = newToken
        user.value = newUser

        localStorage.setItem(TOKEN_KEY, newToken)
        localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    }

    /**
     * Clear authentication data
     */
    function clearAuth() {
        token.value = null
        user.value = null

        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    }

    /**
     * Initialize auth state from localStorage
     * Called on app startup
     */
    async function initAuth() {
        const storedToken = localStorage.getItem(TOKEN_KEY)
        const storedUser = localStorage.getItem(USER_KEY)

        if (storedToken && authService.isTokenValid(storedToken)) {
            token.value = storedToken

            if (storedUser) {
                try {
                    user.value = JSON.parse(storedUser)
                } catch {
                    // If parsing fails, try to get user from token
                    const response = await authService.getCurrentUser(storedToken)
                    if (response.success) {
                        user.value = response.data
                        localStorage.setItem(USER_KEY, JSON.stringify(response.data))
                    }
                }
            }
        } else {
            // Token invalid or expired, clear storage
            clearAuth()
        }
    }

    /**
     * Login user
     */
    async function login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
        isLoading.value = true

        try {
            const response = await authService.login(email, password)

            if (response.success) {
                setAuth(response.data.token, response.data.user)
                return { success: true }
            } else {
                return { success: false, message: response.message }
            }
        } catch {
            return { success: false, message: 'An error occurred during login' }
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Logout user
     */
    async function logout(): Promise<void> {
        isLoading.value = true

        try {
            await authService.logout()
        } finally {
            clearAuth()
            isLoading.value = false
        }
    }

    return {
        // State
        user,
        token,
        isLoading,
        // Getters
        isAuthenticated,
        // Actions
        setAuth,
        clearAuth,
        initAuth,
        login,
        logout
    }
})
