import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { RegisterDto } from '../users/dto/register.dto'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/modules/users/schemas/user.schema'
import { Cache } from 'cache-manager'

import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrPhoneNumber(email)
    console.log(user)

    if (!user) {
      return null
    }

    const valid = await bcrypt.compare(pass, user.password)

    if (valid) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async login(user: User): Promise<any> {
    const token = await this.generateToken(user)
    return { token }
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const newUser = await this.usersService.register(registerDto)
    const token = await this.generateToken(newUser)

    return { user: newUser, token }
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user)
    await this.cacheManager.set(token, 1)
    return token
  }

  async logout(req): Promise<any> {
    if (req?.headers?.authorization) {
      const token = req?.headers?.authorization?.replace('Bearer ', '')
      await this.cacheManager.del(token)
    }
    return { message: 'Removed token' }
  }
}
