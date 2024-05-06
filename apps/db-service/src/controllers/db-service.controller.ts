import { Controller, Get } from '@nestjs/common';
import { DbServiceService } from '../services/db-service.service';

@Controller()
export class DbServiceController {
  constructor(private readonly dbServiceService: DbServiceService) {}

  @Get()
  getHello(): string {
    return this.dbServiceService.getHello();
  }
}
