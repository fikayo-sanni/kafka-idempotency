import { Controller, Logger, UseGuards, ValidationPipe } from '@nestjs/common';
import { DbServiceService } from '../services/db-service.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserMessageDto } from '../../../../libs/common/src/dto/create-user.dto';
import { UpdateUserMessageDto } from '../../../../libs/common/src/dto/update-user.dto';
import { IdempotencyGuard } from '../guards/idempotency.guard';

@Controller()
export class DbServiceController {
  constructor(
    private readonly dbServiceService: DbServiceService,
    private readonly logger: Logger,
  ) {}

  @EventPattern('create_user')
  @UseGuards(IdempotencyGuard)
  async createUser(@Payload(ValidationPipe) data: CreateUserMessageDto) {
    return await this.dbServiceService.create(data.message);
  }

  @EventPattern('update_user')
  @UseGuards(IdempotencyGuard)
  async updateUser(@Payload(ValidationPipe) data: UpdateUserMessageDto) {
    return await this.dbServiceService.update(data.message);
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
  async deleteUser(@Payload('message') message: { id: number }) {
    return await this.dbServiceService.delete(message.id);
  }
}
