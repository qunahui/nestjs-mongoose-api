import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PaginationModule } from 'src/pagination/pagination.module'
import { AdminController } from './admin.controller'
import { UserSchema } from './schemas/user.schema'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), PaginationModule],
  providers: [UsersService],
  controllers: [AdminController, UsersController],
  exports: [UsersService],
})
export class UsersModule {}
