import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

/**
 * Create and configure axios instance
 */
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
})

/**
 * Request interceptor
 * - Adds Authorization header if token exists
 */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token')

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * Response interceptor
 * - Handles 401 errors (redirect to login)
 * - Transforms response data
 */
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            // Clear stored token
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')

            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
