import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiServiceService } from '../services/api-service.service';
import { CreateUserDto } from '../../../../libs/common/src/dto/create-user.dto';
import { UpdateUserDto } from '../../../../libs/common/src/dto/update-user.dto';

@Controller()
export class ApiServiceController {
  constructor(private readonly apiServiceService: ApiServiceService) {}

  @Post()
  createUser(@Body(ValidationPipe) body: CreateUserDto) {
    return this.apiServiceService.createUser(body);
  }

  @Put(':id')
  updateUser(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(ValidationPipe) body: UpdateUserDto,
  ) {
    return this.apiServiceService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.apiServiceService.deleteUser(id);
  }

  @Get(':id')
  getUser(@Param('id', new ParseIntPipe()) id: number) {
    return this.apiServiceService.getUser(id);
  }

  @Get('')
  getUsers() {
    return this.apiServiceService.getUsers();
  }
}
