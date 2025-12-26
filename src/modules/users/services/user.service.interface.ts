import type { ICrudService } from '@/core/composables/useCrud'
import type { User, CreateUserDto, UpdateUserDto, UserFilter } from '../types'

export interface IUserService extends ICrudService<User, CreateUserDto, UpdateUserDto, UserFilter> {
    // Add specific user methods here if needed (e.g. changePassword)
}
