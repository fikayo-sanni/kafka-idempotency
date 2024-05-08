import { Test, TestingModule } from '@nestjs/testing';
import { ApiServiceController } from './api-service.controller';
import { ApiServiceService } from '../services/api-service.service';
import { CreateUserDto } from '@app/common/dto/create-user.dto';
import { UpdateUserDto } from '@app/common/dto/update-user.dto';

// Mock ApiServiceService
const mockApiServiceService = {
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  getUser: jest.fn(),
  getUsers: jest.fn(),
};

describe('ApiServiceController', () => {
  let controller: ApiServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiServiceController],
      providers: [
        { provide: ApiServiceService, useValue: mockApiServiceService },
      ],
    }).compile();

    controller = module.get<ApiServiceController>(ApiServiceController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const user: CreateUserDto = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
      };

      jest.spyOn(mockApiServiceService, 'createUser').mockReturnValueOnce(user);

      const result = await controller.createUser(user);

      expect(result).toEqual(user);
      expect(mockApiServiceService.createUser).toHaveBeenCalledWith(user);
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

      jest
        .spyOn(mockApiServiceService, 'updateUser')
        .mockReturnValueOnce(updateUser);

      const result = await controller.updateUser(userId, updateUser);

      expect(result).toEqual(updateUser);
      expect(mockApiServiceService.updateUser).toHaveBeenCalledWith(
        userId,
        updateUser,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const userId = 1;
      const response = { id: userId };

      jest
        .spyOn(mockApiServiceService, 'deleteUser')
        .mockReturnValueOnce(response);

      const result = await controller.deleteUser(userId);

      expect(result).toEqual(response);
      expect(mockApiServiceService.deleteUser).toHaveBeenCalledWith(userId);
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

      jest.spyOn(mockApiServiceService, 'getUser').mockReturnValueOnce(user);

      const result = await controller.getUser(userId);

      expect(result).toEqual(user);
      expect(mockApiServiceService.getUser).toHaveBeenCalledWith(userId);
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
        {
          id: 2,
          firstname: 'Jane',
          lastname: 'Doe',
          email: 'jane@example.com',
        },
      ];

      jest.spyOn(mockApiServiceService, 'getUsers').mockReturnValueOnce(users);

      const result = await controller.getUsers();

      expect(result).toEqual(users);
      expect(mockApiServiceService.getUsers).toHaveBeenCalled();
    });
  });
});
