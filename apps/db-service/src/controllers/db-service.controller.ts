import { Controller, UseGuards, ValidationPipe } from '@nestjs/common';
import { DbServiceService } from '../services/db-service.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'libs/common/src/dto/create-user.dto';
import { UpdateUserDto } from 'libs/common/src/dto/update-user.dto';
import { IdempotencyGuard } from '../guards/idempotency.guard';

@Controller()
export class DbServiceController {
  constructor(private readonly dbServiceService: DbServiceService) {}

  @EventPattern('create_user')
  @UseGuards(IdempotencyGuard)
  async createUser(@Payload(ValidationPipe) data: CreateUserDto) {
    await this.dbServiceService.create(data);
  }

  @EventPattern('update_user')
  @UseGuards(IdempotencyGuard)
  async updateUser(@Payload(ValidationPipe) data: UpdateUserDto) {
    return await this.dbServiceService.update(data);
  }

  @MessagePattern('fetch_user')
  async fetchUser(@Payload('id') id: number) {
    return await this.dbServiceService.findById(id);
  }

  @MessagePattern('fetch_users')
  async fetchUsers() {
    return await this.dbServiceService.findAll();
  }

  @EventPattern('delete_user')
  @UseGuards(IdempotencyGuard)
  async deleteUser(@Payload('id') id: number) {
    return await this.dbServiceService.delete(id);
  }
}
