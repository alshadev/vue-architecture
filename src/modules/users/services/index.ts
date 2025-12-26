import { MockUserService } from './user.service.mock'
import type { IUserService } from './user.service.interface'

// In the future, we can switch this based on env variable
// const useRealApi = import.meta.env.VITE_USE_REAL_API === 'true'
// export const userService: IUserService = useRealApi ? new RealUserService() : new MockUserService()

export const userService: IUserService = new MockUserService()
