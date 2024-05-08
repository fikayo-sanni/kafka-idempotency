import { Logger, Module } from '@nestjs/common';
import { ApiRedisService } from './redis.service';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const moduleOptions: RedisModuleOptions = {
          closeClient: true,
          readyLog: true,
          errorLog: true,
          config: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          },
        };
        return moduleOptions;
      },
    }),
  ],
  providers: [ApiRedisService, Logger],
  exports: [ApiRedisService],
})
export class ApiRedisModule {}
