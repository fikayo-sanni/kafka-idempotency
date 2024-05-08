import { Logger, Module } from '@nestjs/common';
import { ApiServiceController } from '../controllers/api-service.controller';
import { ApiServiceService } from '../services/api-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiServiceUtils } from '../utils/api-service.utils';
import { ApiRedisService } from '../../../../libs/common/src/redis/redis.service';
import { ApiRedisModule } from '../../../../libs/common/src/redis/redis.module';

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
    ApiRedisModule,
  ],
  controllers: [ApiServiceController],
  providers: [ApiServiceService, ApiServiceUtils, ApiRedisService, Logger],
})
export class ApiServiceModule {}
