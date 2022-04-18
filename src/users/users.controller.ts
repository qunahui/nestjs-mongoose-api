import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    const userId = req?.user?.id
    return userId
    // return this.usersService.getProfile(userId)
  }
}
