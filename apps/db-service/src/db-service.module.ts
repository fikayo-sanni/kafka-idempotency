import { Logger, Module } from '@nestjs/common';
import { DbServiceController } from './controllers/db-service.controller';
import { DbServiceService } from './services/db-service.service';
import { ConfigModule } from '@nestjs/config';
import { userProviders } from '../../../libs/common/src/db/providers/users.providers';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../../libs/common/src/db/models/user.model';
import { ApiRedisService } from '../../../libs/common/src/redis/redis.service';
import { ApiRedisModule } from '../../../libs/common/src/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: 'redis',
          port: 6379,
        },
      },
    ]),
    SequelizeModule.forRootAsync({
      useFactory: async () => ({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: 5432,
        models: [User],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    ApiRedisModule,
  ],
  controllers: [DbServiceController],
  providers: [DbServiceService, ApiRedisService, Logger, ...userProviders],
})
export class DbServiceModule {}
