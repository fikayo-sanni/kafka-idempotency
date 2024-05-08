import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiRedisService } from '../../../../libs/common/src/redis/redis.service';

@Injectable()
export class IdempotencyGuard implements CanActivate {
  constructor(private readonly redisService: ApiRedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const message = context.switchToRpc().getData();

    const isProcessed = await this.redisService.findIdempotency(message.id);
    if (isProcessed) {
      return false;
    }

    await this.redisService.createIdempotency(message.id);
    return true;
  }
}
