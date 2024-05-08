import { Module } from '@nestjs/common';
import { ApiServiceModule } from './modules/api-service.module';

@Module({
  imports: [ApiServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
