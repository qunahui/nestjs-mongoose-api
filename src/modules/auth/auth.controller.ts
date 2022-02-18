import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { Public } from 'src/core/decorators/auth.decorator'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RegisterDto } from '../users/dto/register.dto'
import { LoginResponseDto } from '../users/dto/login-response.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto): Promise<LoginResponseDto> {
    return await this.authService.register(registerDto)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req): Promise<LoginResponseDto> {
    return req.user
  }

  @Public()
  @Get('/logout')
  async logout(@Request() req) {
    return await this.authService.logout(req)
  }
}
