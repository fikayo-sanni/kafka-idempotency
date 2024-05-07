// idempotency.guard.ts

import { RedisService } from '@app/common/redis/redis.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const message = context.getArgs()[0].value; // Assuming the Kafka message is passed as the first argument
    const messageId = message.msg_id; // Assuming the message has an ID

    const isProcessed = await this.redisService.getValue(messageId);
    if (isProcessed) {
      // Message has already been processed, return false to prevent further processing
      return false;
    }

    // Message has not been processed, mark it as processed in Redis and return true
    await this.redisService.setValue(messageId, 'processed');
    return true;
  }
}
