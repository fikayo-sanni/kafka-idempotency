import { Module } from '@nestjs/common';
import { DbServiceController } from './controllers/db-service.controller';
import { DbServiceService } from './services/db-service.service';

@Module({
  imports: [],
  controllers: [DbServiceController],
  providers: [DbServiceService],
})
export class DbServiceModule {}
