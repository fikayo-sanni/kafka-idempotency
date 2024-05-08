import {
  getRedisToken,
  DEFAULT_REDIS_NAMESPACE,
} from '@liaoliaots/nestjs-redis';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiRedisService } from './redis.service';
import { Logger } from '@nestjs/common';

describe('ApiRedisService', () => {
  let service: ApiRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiRedisService,
        {
          provide: getRedisToken(DEFAULT_REDIS_NAMESPACE),
          useValue: jest.fn(),
        },
        {
          provide: Logger,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<ApiRedisService>(ApiRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
