// idempotency.guard.ts

import { RedisService } from '@app/common/redis/redis.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let message = context.switchToRpc().getData();
    const isProcessed = await this.redisService.getValue(message.id);
    if (isProcessed) {
      // Message has already been processed, return false to prevent further processing
      return false;
    }

    // Message has not been processed, mark it as processed in Redis and return true
    await this.redisService.setValue(message.id, 'processed');
    message = message.message;
    return true;
  }
}
