import { Global, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import * as redisStore from 'cache-manager-redis-store'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //env loader
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
      ttl: 48 * 60 * 60,
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  ],
  exports: [JwtModule],
})
export class CommonModule {}
