/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
    code?: number
}

/**
 * User entity
 */
export interface User {
    id: string
    name: string
    email: string
    avatar?: string
}

/**
 * JWT Token Payload
 */
export interface JWTPayload {
    sub: string
    name: string
    email: string
    iat: number
    exp: number
}

/**
 * Navigation menu item
 */
export interface MenuItem {
    key: string
    icon: string
    label: string
    route?: string
    children?: MenuItem[]
}

/**
 * Navigation menu group (for sidebar sections)
 */
export interface MenuGroup {
    key: string
    label?: string  // Optional - if not provided, items render without header
    items: MenuItem[]
}

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Supported locales
 */
export type Locale = 'en' | 'id'

/**
 * Login credentials
 */
export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
}
