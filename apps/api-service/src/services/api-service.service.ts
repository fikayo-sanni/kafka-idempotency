import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/common/src/dto/create-user.dto';
import { UpdateUserDto } from 'libs/common/src/dto/update-user.dto';
import { ApiServiceUtils } from '../utils/api-service.utils';
@Injectable()
export class ApiServiceService {
  constructor(
    @Inject('DB_SERVICE') private readonly dbClient: ClientKafka,
    readonly utils: ApiServiceUtils,
    readonly logger: Logger,
  ) {}

  async createUser(user: CreateUserDto) {
    return this.dbClient.emit('create_user', this.utils.generateMsg(user));
  }

  async getUser(id: number) {
    return this.dbClient.send('fetch_user', { id }).subscribe();
  }

  async getUsers() {
    return this.dbClient.send('fetch_users', '').subscribe();
  }

  async updateUser(id: number, user: UpdateUserDto) {
    return this.dbClient.emit(
      'update_user',
      this.utils.generateMsg({ id, ...user }),
    );
  }

  async deleteUser(id: number) {
    return this.dbClient.emit('delete_user', this.utils.generateMsg({ id }));
  }

  async onModuleInit() {
    this.dbClient.subscribeToResponseOf('fetch_user');
    this.dbClient.subscribeToResponseOf('fetch_users');
  }
}
