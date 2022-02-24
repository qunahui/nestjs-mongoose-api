import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import { ServeStaticModule } from '@nestjs/serve-static'

import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { RolesModule } from './modules/roles/roles.module'
import { DatabaseModule } from './database/database.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RolesGuard } from './core/guards'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
      ttl: 48 * 60 * 60,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/image',
      rootPath: join(__dirname, '..', 'storage'),
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    DatabaseModule,
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
