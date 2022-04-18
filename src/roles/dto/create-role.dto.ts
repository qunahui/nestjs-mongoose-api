import { IsNotEmpty } from 'class-validator'

export class CreateRoleDto {
  @IsNotEmpty({
    message: 'Name should not be empty',
  })
  name: string

  @IsNotEmpty({
    message: 'Slug should not be empty',
  })
  slug: string
}
