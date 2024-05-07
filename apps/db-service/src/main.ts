import { NestFactory } from '@nestjs/core';
import { DbServiceModule } from './db-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

async function bootstrap() {
  // const app = await NestFactory.create(DbServiceModule);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DbServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${uuidv4()}`,
          brokers: [process.env.KAFKA_URI],
        },
        consumer: {
          groupId: 'consumer',
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
