import { Module } from '@nestjs/common';
import { DbServiceController } from './db-service.controller';
import { DbServiceService } from './db-service.service';

@Module({
  imports: [],
  controllers: [DbServiceController],
  providers: [DbServiceService],
})
export class DbServiceModule {}
