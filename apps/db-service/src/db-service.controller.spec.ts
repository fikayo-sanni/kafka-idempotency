import { Test, TestingModule } from '@nestjs/testing';
import { DbServiceController } from './db-service.controller';
import { DbServiceService } from './db-service.service';

describe('DbServiceController', () => {
  let dbServiceController: DbServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DbServiceController],
      providers: [DbServiceService],
    }).compile();

    dbServiceController = app.get<DbServiceController>(DbServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(dbServiceController.getHello()).toBe('Hello World!');
    });
  });
});
