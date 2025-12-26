import type { ApiResponse, JWTPayload } from '@/core/types'

/**
 * Mock API utility for development
 * Simulates API calls with delays and JWT token generation
 */
export class MockApi {
    /**
     * Simulate network delay
     */
    static delay(ms: number = 800): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Create a successful API response
     */
    static success<T>(data: T, message?: string): ApiResponse<T> {
        return {
            success: true,
            data,
            message,
            code: 200
        }
    }

    /**
     * Create an error API response
     */
    static error<T = never>(message: string, code: number = 400): ApiResponse<T> {
        return {
            success: false,
            data: null as T,
            message,
            code
        }
    }

    /**
     * Generate a mock JWT token
     * Note: This is a simplified mock - not cryptographically secure
     */
    static generateJWT(payload: { sub: string; name: string; email: string }): string {
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        }

        const now = Math.floor(Date.now() / 1000)
        const jwtPayload: JWTPayload = {
            ...payload,
            iat: now,
            exp: now + 86400 // 24 hours expiry
        }

        const encodedHeader = MockApi.base64UrlEncode(JSON.stringify(header))
        const encodedPayload = MockApi.base64UrlEncode(JSON.stringify(jwtPayload))
        const signature = MockApi.base64UrlEncode('mock-signature-' + payload.sub)

        return `${encodedHeader}.${encodedPayload}.${signature}`
    }

    /**
     * Decode a mock JWT token
     */
    static decodeJWT(token: string): JWTPayload | null {
        try {
            const parts = token.split('.')
            if (parts.length !== 3) return null

            const payloadPart = parts[1]
            if (!payloadPart) return null

            const payload = JSON.parse(MockApi.base64UrlDecode(payloadPart))

            // Check if token is expired
            const now = Math.floor(Date.now() / 1000)
            if (payload.exp && payload.exp < now) {
                return null
            }

            return payload as JWTPayload
        } catch {
            return null
        }
    }

    /**
     * Check if JWT token is valid and not expired
     */
    static isTokenValid(token: string): boolean {
        const payload = MockApi.decodeJWT(token)
        return payload !== null
    }

    /**
     * Base64 URL encode
     */
    private static base64UrlEncode(str: string): string {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    }

    /**
     * Base64 URL decode
     */
    private static base64UrlDecode(str: string): string {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
        const padding = base64.length % 4
        if (padding) {
            base64 += '='.repeat(4 - padding)
        }
        return atob(base64)
    }
}
