import { IsOptional, IsString } from 'class-validator'
import { ROLE } from 'src/constants'

export class UpdateUserDto {
  @IsString()
  role?: ROLE

  @IsOptional()
  displayName?: string
}
