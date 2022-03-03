import { Exclude } from 'class-transformer'

export class UserEntity {
  id?: any

  email: string

  @Exclude()
  password: string

  displayName: string

  phone: string

  role: string

  isActive?: boolean

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
