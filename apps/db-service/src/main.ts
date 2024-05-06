import { NestFactory } from '@nestjs/core';
import { DbServiceModule } from './db-service.module';

async function bootstrap() {
  const app = await NestFactory.create(DbServiceModule);
  await app.listen(3000);
}
bootstrap();
