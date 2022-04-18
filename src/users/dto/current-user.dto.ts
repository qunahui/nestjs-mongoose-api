import { IsString } from 'class-validator'
import { ROLE } from 'src/constants'

export class CurrentUserDto {
  @IsString()
  id: string

  @IsString()
  email: string

  @IsString()
  phone: string

  @IsString()
  displayName: string

  @IsString()
  role: ROLE
}
