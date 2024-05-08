import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto } from '@app/common/dto/create-user.dto';
import { UpdateUserDto } from '@app/common/dto/update-user.dto';
import { ApiServiceModule } from '../src/modules/api-service.module';
import { Consumer } from 'kafkajs';
import { ApiRedisService } from '../../../libs/common/src/redis/redis.service';
import { ClientsModule } from '@nestjs/microservices';
import { AppModule } from '../src/app.module';

describe('ApiServiceControllerE2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
    };

    return request(app.getHttpServer())
      .post('/')
      .send(createUserDto)
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body).toBeDefined();
      });
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      firstname: 'UpdatedJohn',
      lastname: 'UpdatedDoe',
      email: 'updatedjohn@example.com',
    };

    return request(app.getHttpServer())
      .put('/1') // Assuming user with ID 1 exists
      .send(updateUserDto)
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toBeDefined();
      });
  });

  it('should delete a user', async () => {
    return request(app.getHttpServer())
      .delete('/1') // Assuming user with ID 1 exists
      .expect(HttpStatus.OK)
      .expect({});
  });

  it('should get a user', async () => {
    return request(app.getHttpServer())
      .get('/1') // Assuming user with ID 1 exists
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toBeDefined();
      });
  });

  it('should get all users', async () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toBeDefined();
      });
  });
});
