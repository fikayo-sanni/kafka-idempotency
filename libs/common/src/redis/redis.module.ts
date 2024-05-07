// redis.module.ts

import { Module } from '@nestjs/common';
import { ClientRedis, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: 'redis',
          port: 6379,
        },
      },
    ]),
  ],
  providers: [ClientRedis],
  exports: [ClientsModule, ClientRedis],
})
export class RedisModule {}
