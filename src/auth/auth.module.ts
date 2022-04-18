import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserSchema } from '../schemas/user.schema'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
