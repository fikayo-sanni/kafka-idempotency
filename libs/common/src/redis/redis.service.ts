import { Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';

@Injectable()
export class RedisService {
  constructor(private readonly redisClient: ClientRedis) {}

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.send('SET', [key, value]).toPromise();
  }

  async getValue(key: string): Promise<string> {
    return this.redisClient.send('GET', [key]).toPromise();
  }
}
