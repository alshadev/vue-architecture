import { MockApi } from '@/core/api/mock-api'
import type { ApiResponse, User } from '@/core/types'

/**
 * Authentication Service
 * Handles login, logout, and user retrieval
 * 
 * Currently uses MockApi for development
 * Replace with real API calls for production
 */
class AuthService {
    /**
     * Login with email and password
     * Returns JWT token and user data
     */
    async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
        // Simulate network delay
        await MockApi.delay(800)

        // For demo purposes, accept any credentials
        // In production, this would validate against a real API
        if (!email || !password) {
            return MockApi.error('Email and password are required', 400)
        }

        // Generate mock user data
        const emailPrefix = email.split('@')[0] || 'user'
        const formattedName = emailPrefix
            .replace(/[._-]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

        const user: User = {
            id: '1',
            name: formattedName,
            email: email,
            avatar: undefined
        }

        // Generate JWT token
        const token = MockApi.generateJWT({
            sub: user.id,
            name: user.name,
            email: user.email
        })

        return MockApi.success({ token, user })
    }

    /**
     * Logout user
     */
    async logout(): Promise<ApiResponse<null>> {
        await MockApi.delay(300)
        return MockApi.success(null, 'Logged out successfully')
    }

    /**
     * Get current user from token
     */
    async getCurrentUser(token: string): Promise<ApiResponse<User>> {
        await MockApi.delay(300)

        const payload = MockApi.decodeJWT(token)

        if (!payload) {
            return MockApi.error('Invalid or expired token', 401)
        }

        const user: User = {
            id: payload.sub,
            name: payload.name,
            email: payload.email
        }

        return MockApi.success(user)
    }

    /**
     * Validate token
     */
    isTokenValid(token: string): boolean {
        return MockApi.isTokenValid(token)
    }
}

export const authService = new AuthService()
