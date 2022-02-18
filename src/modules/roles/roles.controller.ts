import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common'
import { PaginationParams } from 'src/core/dto/paginationParams.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateRoleDto } from './dto/create-role.dto'
import { RolesService } from './roles.service'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  paginated(@Query() paginationParams: PaginationParams) {
    return this.rolesService.paginated(paginationParams)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  create(@Body() createRoleDto: CreateRoleDto): Promise<any> {
    return this.rolesService.create(createRoleDto)
  }
}
