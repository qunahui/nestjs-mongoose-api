import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { RegisterDto } from '../users/dto/register.dto'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'

import * as bcrypt from 'bcrypt'
import { LoginResponseDto } from '../users/dto/login-response.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrPhoneNumber(email)

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

  async login(user: any): Promise<LoginResponseDto> {
    const token = await this.generateToken({ userId: user.id })
    return { token }
  }

  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const newUser = await this.usersService.register(registerDto)
    const token = await this.generateToken({ userId: newUser.id })

    return { token }
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
