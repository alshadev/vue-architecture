import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.store'

/**
 * Login composable
 * Handles login form state and submission logic
 */
export function useLogin() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Form state
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)

    // UI state
    const error = ref<string | null>(null)

    // Computed
    const isLoading = computed(() => authStore.isLoading)

    const isFormValid = computed(() => {
        return email.value.trim() !== '' && password.value.trim() !== ''
    })

    /**
     * Handle login submission
     */
    async function login() {
        // Reset error
        error.value = null

        // Validate
        if (!isFormValid.value) {
            error.value = 'Please fill in all fields'
            return
        }

        // Attempt login
        const result = await authStore.login(email.value, password.value)

        if (result.success) {
            // Clear form
            email.value = ''
            password.value = ''

            // Redirect to dashboard
            router.push('/')
        } else {
            error.value = result.message || 'Login failed'
        }
    }

    /**
     * Clear form and error
     */
    function resetForm() {
        email.value = ''
        password.value = ''
        rememberMe.value = false
        error.value = null
    }

    return {
        // Form state
        email,
        password,
        rememberMe,
        // UI state
        error,
        isLoading,
        isFormValid,
        // Actions
        login,
        resetForm
    }
}
