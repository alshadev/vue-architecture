export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'editor' | 'viewer'
    status: 'active' | 'inactive' | 'pending'
    avatar?: string
    lastLogin?: string
    createdAt: string
}

export interface UserFilter {
    search?: string
    role?: string
    status?: string
}

export interface CreateUserDto {
    name: string
    email: string
    role: 'admin' | 'editor' | 'viewer'
    status: 'active' | 'inactive' | 'pending'
    avatar?: string
}

export interface UpdateUserDto extends Partial<CreateUserDto> { }
