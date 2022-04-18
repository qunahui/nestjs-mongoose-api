import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { CurrentUserDto } from 'src/users/dto/current-user.dto'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any): Promise<CurrentUserDto> {
    const user_id = payload?.user_id
    const user = await this.usersService.findOne(user_id)

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      displayName: user.displayName,
    }
  }
}
