import { Module } from '@nestjs/common'
import { DatabaseModule } from './modules/database/database.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { CacheModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RolesModule } from './modules/roles/roles.module'
import * as redisStore from 'cache-manager-redis-store'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RolesGuard } from './core/guards'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //env loader
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
      ttl: 48 * 60 * 60,
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
