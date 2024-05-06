import { Module } from '@nestjs/common';
import { ApiServiceController } from './controllers/api-service.controller';
import { ApiServiceService } from './services/api-service.service';

@Module({
  imports: [],
  controllers: [ApiServiceController],
  providers: [ApiServiceService],
})
export class ApiServiceModule {}
