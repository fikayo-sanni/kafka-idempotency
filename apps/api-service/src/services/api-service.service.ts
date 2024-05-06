import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/common/src/dto/create-user.dto';
import { UpdateUserDto } from 'libs/common/src/dto/update-user.dto';
@Injectable()
export class ApiServiceService {
  constructor(
    @Inject('DB_SERVICE') private readonly dbClient: ClientKafka,
    readonly logger: Logger,
  ) {}

  async createUser(user: CreateUserDto) {
    return this.dbClient.emit('create_user', JSON.stringify(user));
  }

  async getUser(id: number) {
    return this.dbClient.send('fetch_user', JSON.stringify({ id }));
  }

  async getUsers() {
    return this.dbClient.send('fetch_users', '');
  }

  async updateUser(id: number, user: UpdateUserDto) {
    return this.dbClient.emit('update_user', JSON.stringify({ id, user }));
  }

  async deleteUser(id: number) {
    return this.dbClient.emit('delete_user', JSON.stringify({ id }));
  }

  async onModuleInit() {
    this.dbClient.subscribeToResponseOf('fetch_user');
    this.dbClient.subscribeToResponseOf('fetch_users');
  }
}
