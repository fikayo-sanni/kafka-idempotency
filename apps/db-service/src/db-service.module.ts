import { Module } from '@nestjs/common';
import { DbServiceController } from './controllers/db-service.controller';
import { DbServiceService } from './services/db-service.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { dbConfig } from '@app/common/db/config/db.config';
import { SequelizeService } from '@app/common/db/db.service';
import { User } from '@app/common/db/models/user.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        dialect: 'postgres',
        ...dbConfig,
      }),
    }),
    SequelizeModule.forFeature([User]),
  ],
  controllers: [DbServiceController],
  providers: [DbServiceService, SequelizeService],
})
export class DbServiceModule {}
