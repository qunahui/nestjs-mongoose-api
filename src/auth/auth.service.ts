import { CACHE_MANAGER, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../schemas/user.schema'
import { Model } from 'mongoose'
import { ROLE } from 'src/constants'
import { UserEntity } from 'src/entities/user.entity'
import { LoginResponse } from './dto/login-response.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserEntity> {
    const newUser = new this.userModel({
      ...registerDto,
    })

    try {
      const createdUser = await newUser.save()
      return createdUser.toJSON()
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user: any = await this.userModel.findOne({
      $or: [
        {
          email: loginDto.username,
        },
        {
          phone: loginDto.username,
        },
      ],
    })

    if (user && (await user.validatePassword(loginDto.password))) {
      const accessToken = this.jwtService.sign({ user_id: user._id.toString() })
      await this.cacheManager.set(`user/${accessToken}`, 1)
      return {
        accessToken,
      }
    } else {
      throw new UnprocessableEntityException('Invalid credentials')
    }
  }

  async adminLogin(loginDto: LoginDto): Promise<LoginResponse> {
    const user: any = await this.userModel.findOne({
      $or: [
        {
          email: loginDto.username,
        },
        {
          phone: loginDto.username,
        },
      ],
      role: ROLE.admin,
    })

    if (user && (await user.validatePassword(loginDto.password))) {
      const accessToken = this.jwtService.sign({ user_id: user._id.toString() })
      await this.cacheManager.set(`user/${accessToken}`, 1)
      return {
        accessToken,
      }
    } else {
      throw new UnprocessableEntityException(
        'Invalid username/password or you dont have permission to login',
      )
    }
  }

  async logout(id: string): Promise<any> {
    try {
      await this.cacheManager.del(`user/${id}`)
    } catch (e) {
      throw new UnprocessableEntityException(e.message)
    }
  }
}
