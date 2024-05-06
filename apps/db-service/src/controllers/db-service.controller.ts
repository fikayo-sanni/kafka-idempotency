import { Controller, ValidationPipe } from '@nestjs/common';
import { DbServiceService } from '../services/db-service.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/common/src/dto/create-user.dto';

@Controller()
export class DbServiceController {
  constructor(private readonly dbServiceService: DbServiceService) {}

  @EventPattern('create_user')
  async createUser(@Payload(ValidationPipe) data: CreateUserDto) {
    await this.dbServiceService.create(data);
  }

  @MessagePattern('fetch_user')
  async fetchUser(@Payload('id') id: number) {
    return await this.dbServiceService.findOne(id);
  }

  @MessagePattern('fetch_users')
  async fetchUsers() {
    return await this.dbServiceService.findAll();
  }

  @MessagePattern('fetch_users')
  async fetchUsers() {
    return await this.dbServiceService.findAll();
  }
}
