import { Body, Controller, Get, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common'
import { Public } from 'src/core/decorators/auth.decorator'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RegisterDto } from '../users/dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  async signUp(@Body(ValidationPipe) registerDto: RegisterDto): Promise<any> {
    return await this.authService.signUp(registerDto)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async signIn(@Request() req): Promise<any> {
    return this.authService.signIn(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user
  }

  @Public()
  @Get('/logout')
  async logout(@Request() req) {
    return await this.authService.logout(req)
  }
}
