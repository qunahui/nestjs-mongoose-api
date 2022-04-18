import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class LoginDto {
  @IsNotEmpty({
    message: 'Email should not be empty',
  })
  @IsEmail()
  readonly username: string

  @IsNotEmpty({
    message: 'Password should not be empty',
  })
  @MinLength(6)
  password: string
}
