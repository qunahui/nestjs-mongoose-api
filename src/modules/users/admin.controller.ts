import { Controller, Get, HttpCode, Query, Res, UseGuards } from '@nestjs/common'
import { Public } from 'src/core/decorators/auth.decorator'
import { FetchDto } from 'src/pagination/dto/fetch.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserEntity } from './entities/user.entity'
import { UsersService } from './users.service'

@Controller('admin/users')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @Public()
  @HttpCode(200)
  async getUsers(@Query() fetch: FetchDto, @Res({ passthrough: true }) res): Promise<any> {
    return this.usersService.paginated(fetch, res)
  }
}
