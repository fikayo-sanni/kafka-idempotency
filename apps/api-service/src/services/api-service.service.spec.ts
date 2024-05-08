import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, Logger } from '@nestjs/common';
import { ApiServiceService } from './api-service.service';
import { ApiRedisService } from 'libs/common/src/redis/redis.service';
import { CreateUserDto } from 'libs/common/src/dto/create-user.dto';
import { UpdateUserDto } from 'libs/common/src/dto/update-user.dto';
import { of, throwError } from 'rxjs';
import { ApiServiceUtils } from '../utils/api-service.utils';

// Mock ClientKafka
const mockDbClient = {
  send: jest.fn(),
  emit: jest.fn(),
  subscribe: jest.fn(),
  subscribeToResponseOf: jest.fn(),
};

// Mock RedisService
const mockRedisService = {
  validateRequestIdempotency: jest.fn().mockResolvedValue(true),
};

// Mock ApiServiceUtils
const mockUtils = {
  generateMsg: jest.fn().mockImplementation((data) => data),
};

describe('ApiServiceService', () => {
  let service: ApiServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiServiceService,
        { provide: 'DB_SERVICE', useValue: mockDbClient },
        { provide: ApiRedisService, useValue: mockRedisService },
        { provide: Logger, useValue: { log: jest.fn() } },
        { provide: ApiServiceUtils, useValue: mockUtils },
      ],
    }).compile();

    service = module.get<ApiServiceService>(ApiServiceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const user: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
      };

      const response = { id: 1, ...user };
      jest.spyOn(mockDbClient, 'emit').mockReturnValueOnce(of(response));

      await expect(service.createUser(user)).resolves.toBeDefined();

      expect(mockRedisService.validateRequestIdempotency).toHaveBeenCalled();
      expect(mockDbClient.emit).toHaveBeenCalledWith('create_user', user);
    });

    it('should throw BadRequestException if request is not idempotent', async () => {
      mockRedisService.validateRequestIdempotency.mockResolvedValueOnce(false);

      await expect(service.createUser({} as CreateUserDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockDbClient.emit).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should get user', async () => {
      const userId = 1;
      const user = {
        id: userId,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
      };
      mockDbClient.send.mockReturnValueOnce(of(user));

      await expect(service.getUser(userId)).resolves.toEqual(user);

      expect(mockDbClient.send).toHaveBeenCalledWith('fetch_user', {
        id: userId,
      });
    });

    it('should throw error if user is not found', async () => {
      const userId = 1;
      mockDbClient.send.mockReturnValueOnce(
        throwError(new Error('User not found')),
      );

      await expect(service.getUser(userId)).rejects.toThrowError(
        'User not found',
      );
    });
  });

  describe('getUsers', () => {
    it('should get users', async () => {
      const users = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
        },
      ];
      mockDbClient.send.mockReturnValueOnce(of(users));

      await expect(service.getUsers()).resolves.toEqual(users);

      expect(mockDbClient.send).toHaveBeenCalledWith('fetch_users', '');
    });

    it('should throw error if users fetching fails', async () => {
      mockDbClient.send.mockReturnValueOnce(
        throwError(new Error('Failed to fetch users')),
      );

      await expect(service.getUsers()).rejects.toThrowError(
        'Failed to fetch users',
      );
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const userId = 1;
      const updateUser: UpdateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
      };
      const response = { id: userId, ...updateUser };
      jest.spyOn(mockDbClient, 'emit').mockReturnValueOnce(of(response));

      await expect(
        service.updateUser(userId, updateUser),
      ).resolves.toBeDefined();

      expect(mockRedisService.validateRequestIdempotency).toHaveBeenCalled();
      expect(mockDbClient.emit).toHaveBeenCalledWith('update_user', {
        id: userId,
        ...updateUser,
      });
    });

    it('should throw BadRequestException if request is not idempotent', async () => {
      mockRedisService.validateRequestIdempotency.mockResolvedValueOnce(false);

      await expect(service.updateUser(1, {} as UpdateUserDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockDbClient.emit).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const userId = 1;
      const response = { id: userId };
      jest.spyOn(mockDbClient, 'emit').mockReturnValueOnce(response);

      await expect(service.deleteUser(userId)).resolves.toBeDefined();

      expect(mockRedisService.validateRequestIdempotency).toHaveBeenCalled();
      expect(mockDbClient.emit).toHaveBeenCalledWith('delete_user', {
        id: userId,
      });
    });

    it('should throw BadRequestException if request is not idempotent', async () => {
      mockRedisService.validateRequestIdempotency.mockResolvedValueOnce(false);

      await expect(service.deleteUser(1)).rejects.toThrow(BadRequestException);

      expect(mockDbClient.emit).not.toHaveBeenCalled();
    });
  });

  describe('onModuleInit', () => {
    it('should subscribe to response of fetch_user and fetch_users', async () => {
      await service.onModuleInit();

      expect(mockDbClient.subscribeToResponseOf).toHaveBeenCalledWith(
        'fetch_user',
      );
      expect(mockDbClient.subscribeToResponseOf).toHaveBeenCalledWith(
        'fetch_users',
      );
    });
  });
});
