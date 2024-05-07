import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { dbConfig } from './config/db.config';

@Injectable()
export class SequelizeService {
  constructor(private configService: ConfigService) {}

  sequelize = new Sequelize({ dialect: 'postgres', ...dbConfig });
}
