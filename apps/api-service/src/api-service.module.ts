import { Logger, Module } from '@nestjs/common';
import { ApiServiceController } from './controllers/api-service.controller';
import { ApiServiceService } from './services/api-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiServiceUtils } from './utils/api-service.utils';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DB_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'app-gateway',
            brokers: [process.env.KAFKA_URI],
          },
          consumer: {
            groupId: 'kafka-microservices',
          },
        },
      },
    ]),
  ],
  controllers: [ApiServiceController],
  providers: [ApiServiceService, ApiServiceUtils, Logger],
})
export class ApiServiceModule {}
