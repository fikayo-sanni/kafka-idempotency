import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import * as IORedis from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class ApiRedisService {
  constructor(
    @InjectRedis() private readonly redis: IORedis.Redis,
    private readonly logger: Logger,
  ) {}

  async validateRequestIdempotency(
    type: string,
    data: unknown,
    expiry?: number,
  ) {
    const hash = this.hashData(data);
    const hashKey = `${type}:${hash}`;

    const exists = await this.redis.exists(hashKey);

    if (exists === 1) {
      return false;
    }
    const timeout = expiry ? expiry : 60 * 60 * 24;
    await this.redis.set(hashKey, 'generated', 'EX', timeout);

    return true;
  }

  private hashData(data: unknown): string {
    const sha256 = crypto.createHash('sha256');
    const jsonStr = JSON.stringify(data);
    sha256.update(jsonStr);
    return sha256.digest('hex');
  }

  async findIdempotency(id: string) {
    const exists = await this.redis.exists(id);

    if (exists) return true;

    return false;
  }

  async createIdempotency(id: string) {
    await this.redis.set(id, 'processed');
  }
}
