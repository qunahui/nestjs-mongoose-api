import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from './database.service';

const databaseUri = (configService: ConfigService) => {
  const env = configService.get<string>('NODE_ENV');
  const URIs = {
    test: configService.get<string>('MONGO_TEST_CONNECTION_URI'),
    dev: configService.get<string>('MONGO_DEV_CONNECTION_URI'),
    stag: configService.get<string>('MONGO_STAG_CONNECTION_URI'),
  };
  return URIs[env];
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: databaseUri(configService),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService, ConfigService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
