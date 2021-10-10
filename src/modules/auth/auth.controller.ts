import { Body, Controller, Get, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { Public } from 'src/core/decorators/auth.decorator';
import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @Post('/sign-up')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<any> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async signIn(@Request() req): Promise<any> {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('/logout')
  async logout(@Request() req) {
    return await this.authService.logout(req);
  }
}
