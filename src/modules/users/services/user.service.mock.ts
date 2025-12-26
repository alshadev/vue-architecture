import type { IUserService } from './user.service.interface'
import type { User, CreateUserDto, UpdateUserDto, UserFilter } from '../types'

// Mock Data
const mockUsers: User[] = [
    { id: '1', name: 'Sarah Smith', email: 'sarah.smith@example.com', role: 'admin', status: 'active', avatar: 'https://i.pravatar.cc/150?u=1', lastLogin: '2024-03-10T08:30:00Z', createdAt: '2024-01-01T10:00:00Z' },
    { id: '2', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'editor', status: 'active', avatar: 'https://i.pravatar.cc/150?u=2', lastLogin: '2024-03-09T14:20:00Z', createdAt: '2024-01-05T09:15:00Z' },
    { id: '3', name: 'Emma Wilson', email: 'emma.wilson@example.com', role: 'viewer', status: 'inactive', avatar: 'https://i.pravatar.cc/150?u=3', lastLogin: '2024-02-28T11:45:00Z', createdAt: '2024-01-10T16:20:00Z' },
    { id: '4', name: 'James Rodriguez', email: 'james.r@example.com', role: 'editor', status: 'pending', avatar: 'https://i.pravatar.cc/150?u=4', lastLogin: '', createdAt: '2024-03-01T08:00:00Z' },
    { id: '5', name: 'Lisa Wong', email: 'lisa.w@example.com', role: 'admin', status: 'active', avatar: 'https://i.pravatar.cc/150?u=5', lastLogin: '2024-03-10T09:00:00Z', createdAt: '2024-01-15T10:30:00Z' },
    { id: '6', name: 'David Miller', email: 'david.m@example.com', role: 'viewer', status: 'active', avatar: 'https://i.pravatar.cc/150?u=6', lastLogin: '2024-03-11T10:00:00Z', createdAt: '2024-02-01T11:00:00Z' },
    { id: '7', name: 'Jennifer Taylor', email: 'jennifer.t@example.com', role: 'editor', status: 'active', avatar: 'https://i.pravatar.cc/150?u=7', lastLogin: '2024-03-12T09:30:00Z', createdAt: '2024-02-05T14:00:00Z' },
    { id: '8', name: 'Robert Anderson', email: 'robert.a@example.com', role: 'viewer', status: 'inactive', avatar: 'https://i.pravatar.cc/150?u=8', lastLogin: '2024-02-20T16:00:00Z', createdAt: '2024-02-10T09:00:00Z' },
    { id: '9', name: 'Patricia Thomas', email: 'patricia.t@example.com', role: 'admin', status: 'active', avatar: 'https://i.pravatar.cc/150?u=9', lastLogin: '2024-03-12T11:00:00Z', createdAt: '2024-02-15T10:00:00Z' },
    { id: '10', name: 'John Martinez', email: 'john.m@example.com', role: 'editor', status: 'pending', avatar: 'https://i.pravatar.cc/150?u=10', lastLogin: '', createdAt: '2024-02-20T13:00:00Z' },
    { id: '11', name: 'Elizabeth Hernandez', email: 'elizabeth.h@example.com', role: 'viewer', status: 'active', avatar: 'https://i.pravatar.cc/150?u=11', lastLogin: '2024-03-11T14:00:00Z', createdAt: '2024-02-25T11:00:00Z' },
    { id: '12', name: 'William Clark', email: 'william.c@example.com', role: 'editor', status: 'active', avatar: 'https://i.pravatar.cc/150?u=12', lastLogin: '2024-03-10T15:00:00Z', createdAt: '2024-03-01T09:00:00Z' },
    { id: '13', name: 'Linda Lewis', email: 'linda.l@example.com', role: 'admin', status: 'inactive', avatar: 'https://i.pravatar.cc/150?u=13', lastLogin: '2024-02-25T10:00:00Z', createdAt: '2024-03-02T10:00:00Z' },
    { id: '14', name: 'Richard Lee', email: 'richard.l@example.com', role: 'viewer', status: 'pending', avatar: 'https://i.pravatar.cc/150?u=14', lastLogin: '', createdAt: '2024-03-03T11:00:00Z' },
    { id: '15', name: 'Barbara Walker', email: 'barbara.w@example.com', role: 'editor', status: 'active', avatar: 'https://i.pravatar.cc/150?u=15', lastLogin: '2024-03-12T12:00:00Z', createdAt: '2024-03-04T12:00:00Z' },
    { id: '16', name: 'Joseph Hall', email: 'joseph.h@example.com', role: 'viewer', status: 'active', avatar: 'https://i.pravatar.cc/150?u=16', lastLogin: '2024-03-11T16:00:00Z', createdAt: '2024-03-05T13:00:00Z' },
    { id: '17', name: 'Susan Allen', email: 'susan.a@example.com', role: 'admin', status: 'active', avatar: 'https://i.pravatar.cc/150?u=17', lastLogin: '2024-03-12T13:00:00Z', createdAt: '2024-03-06T14:00:00Z' },
    { id: '18', name: 'Thomas Young', email: 'thomas.y@example.com', role: 'editor', status: 'inactive', avatar: 'https://i.pravatar.cc/150?u=18', lastLogin: '2024-02-28T14:00:00Z', createdAt: '2024-03-07T15:00:00Z' },
    { id: '19', name: 'Margaret King', email: 'margaret.k@example.com', role: 'viewer', status: 'pending', avatar: 'https://i.pravatar.cc/150?u=19', lastLogin: '', createdAt: '2024-03-08T09:00:00Z' },
    { id: '20', name: 'Charles Wright', email: 'charles.w@example.com', role: 'admin', status: 'active', avatar: 'https://i.pravatar.cc/150?u=20', lastLogin: '2024-03-12T15:00:00Z', createdAt: '2024-03-09T10:00:00Z' },
    { id: '21', name: 'Jessica Scott', email: 'jessica.s@example.com', role: 'editor', status: 'active', avatar: 'https://i.pravatar.cc/150?u=21', lastLogin: '2024-03-11T09:00:00Z', createdAt: '2024-03-10T11:00:00Z' },
    { id: '22', name: 'Christopher Green', email: 'christopher.g@example.com', role: 'viewer', status: 'active', avatar: 'https://i.pravatar.cc/150?u=22', lastLogin: '2024-03-10T12:00:00Z', createdAt: '2024-03-11T12:00:00Z' },
    { id: '23', name: 'Karen Adams', email: 'karen.a@example.com', role: 'admin', status: 'inactive', avatar: 'https://i.pravatar.cc/150?u=23', lastLogin: '2024-02-15T10:00:00Z', createdAt: '2024-03-12T13:00:00Z' },
    { id: '24', name: 'Daniel Baker', email: 'daniel.b@example.com', role: 'editor', status: 'pending', avatar: 'https://i.pravatar.cc/150?u=24', lastLogin: '', createdAt: '2024-03-12T14:00:00Z' },
    { id: '25', name: 'Nancy Gonzalez', email: 'nancy.g@example.com', role: 'viewer', status: 'active', avatar: 'https://i.pravatar.cc/150?u=25', lastLogin: '2024-03-12T16:00:00Z', createdAt: '2024-03-12T15:00:00Z' }
]

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export class MockUserService implements IUserService {
    private users: User[] = [...mockUsers]

    async getAll(params?: UserFilter & { page: number; limit: number }): Promise<{ data: User[]; total: number }> {
        await delay(500)

        let filtered = [...this.users]

        if (params?.search) {
            const query = params.search.toLowerCase()
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
            )
        }

        if (params?.role) {
            filtered = filtered.filter(u => u.role === params.role)
        }

        if (params?.status) {
            filtered = filtered.filter(u => u.status === params.status)
        }

        const total = filtered.length

        // Pagination
        const start = (params?.page && params?.limit) ? (params.page - 1) * params.limit : 0
        const end = (params?.page && params?.limit) ? start + params.limit : total

        return {
            data: filtered.slice(start, end),
            total
        }
    }

    async getById(id: string): Promise<User> {
        await delay(300)
        const user = this.users.find(u => u.id === id)
        if (!user) throw new Error('User not found')
        return user
    }

    async create(data: CreateUserDto): Promise<User> {
        await delay(600)
        const newUser: User = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            lastLogin: ''
        }
        this.users.unshift(newUser) // Add to beginning
        return newUser
    }

    async update(id: string, data: UpdateUserDto): Promise<User> {
        await delay(600)
        const index = this.users.findIndex(u => u.id === id)
        if (index === -1) throw new Error('User not found')

        const updatedUser = { ...this.users[index], ...data } as User
        this.users[index] = updatedUser
        return updatedUser
    }

    async delete(id: string): Promise<void> {
        await delay(400)
        const index = this.users.findIndex(u => u.id === id)
        if (index === -1) throw new Error('User not found')

        this.users.splice(index, 1)
    }
}
