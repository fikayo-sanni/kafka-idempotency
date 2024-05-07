import { Logger, Module } from '@nestjs/common';
import { DbServiceController } from './controllers/db-service.controller';
import { DbServiceService } from './services/db-service.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@app/common/redis/redis.module';
import { RedisService } from '@app/common/redis/redis.service';
import { userProviders } from '@app/common/db/providers/users.providers';

@Module({
  imports: [ConfigModule.forRoot(), RedisModule],
  controllers: [DbServiceController],
  providers: [DbServiceService, RedisService, Logger, ...userProviders],
})
export class DbServiceModule {}
