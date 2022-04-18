import { Exclude } from 'class-transformer'
import { IsString } from 'class-validator'
import { ROLE } from 'src/constants'

export class UserEntity {
  @IsString()
  id?: any

  @IsString()
  email: string

  @Exclude()
  password: string

  @IsString()
  displayName: string

  @IsString()
  phone: string

  @IsString()
  role: ROLE

  isActive?: boolean

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
