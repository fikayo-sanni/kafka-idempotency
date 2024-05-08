import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from '../../../../libs/common/src/dto/create-user.dto';
import { UpdateUserDto } from '../../../../libs/common/src/dto/update-user.dto';
import { ApiServiceUtils } from '../utils/api-service.utils';
import { ApiRedisService } from '../../../../libs/common/src/redis/redis.service';
import { User } from '../../../../libs/common/src/db/models/user.model';
@Injectable()
export class ApiServiceService {
  constructor(
    @Inject('DB_SERVICE') private readonly dbClient: ClientKafka,
    readonly redisService: ApiRedisService,
    readonly utils: ApiServiceUtils,
    readonly logger: Logger,
  ) {}

  async createUser(user: CreateUserDto) {
    const event_type = 'create_user';
    const idempotent = await this.redisService.validateRequestIdempotency(
      event_type,
      user,
    );

    if (!idempotent) {
      throw new BadRequestException(`Non Idempotent Request`);
    }

    return this.dbClient.emit(event_type, this.utils.generateMsg(user));
  }

  async getUser(id: number) {
    return new Promise((resolve, reject) => {
      this.dbClient.send('fetch_user', { id }).subscribe({
        next: (user: User) => {
          resolve(user);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  async getUsers() {
    return new Promise((resolve, reject) => {
      this.dbClient.send('fetch_users', '').subscribe({
        next: (users: Array<User>) => {
          resolve(users);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  async updateUser(id: number, user: UpdateUserDto) {
    try {
      const event_type = 'update_user';
      const idempotent = await this.redisService.validateRequestIdempotency(
        event_type,
        user,
      );

      if (!idempotent) {
        throw new BadRequestException(`Non Idempotent Request`);
      }

      return this.dbClient.emit(
        event_type,
        this.utils.generateMsg({ id, ...user }),
      );
    } catch (e) {
      throw e;
    }
  }

  async deleteUser(id: number) {
    const event_type = 'delete_user';
    const idempotent = await this.redisService.validateRequestIdempotency(
      event_type,
      {
        id,
      },
    );

    if (!idempotent) {
      throw new BadRequestException(`Non Idempotent Request`);
    }
    return this.dbClient.emit(event_type, this.utils.generateMsg({ id }));
  }

  async onModuleInit() {
    this.dbClient.subscribeToResponseOf('fetch_user');
    this.dbClient.subscribeToResponseOf('fetch_users');
  }
}
