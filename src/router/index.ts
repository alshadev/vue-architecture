import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/auth.store'

// Route components - lazy loaded
const LoginPage = () => import('@/modules/auth/views/LoginPage.vue')
const DashboardPage = () => import('@/modules/dashboard/views/DashboardPage.vue')

/**
 * Route definitions
 */
const routes: RouteRecordRaw[] = [
    // Auth routes
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
            guest: true, // Only accessible when NOT logged in
            title: 'Login'
        }
    },

    // Protected routes
    {
        path: '/',
        name: 'dashboard',
        component: DashboardPage,
        meta: {
            requiresAuth: true,
            title: 'Dashboard'
        }
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('@/modules/users/views/UsersPage.vue'),
        meta: {
            requiresAuth: true,
            title: 'Users'
        }
    },

    // Catch-all redirect
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

/**
 * Create router instance
 */
const router = createRouter({
    history: createWebHistory(),
    routes
})

/**
 * Navigation guard
 * Handles authentication redirects
 */
router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    // Initialize auth state if not done yet
    if (!authStore.token) {
        await authStore.initAuth()
    }

    const isAuthenticated = authStore.isAuthenticated
    const requiresAuth = to.meta.requiresAuth
    const isGuestRoute = to.meta.guest

    // Update document title
    const baseTitle = 'Vue Admin'
    document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle

    // Route requires auth but user is not authenticated
    if (requiresAuth && !isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } })
        return
    }

    // Guest route (like login) but user is already authenticated
    if (isGuestRoute && isAuthenticated) {
        next({ name: 'dashboard' })
        return
    }

    // Continue to route
    next()
})

export default router
