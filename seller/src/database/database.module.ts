import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DATABASE_CONFIG_NAME,
  DatabaseConfig,
} from 'src/config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const options = configService.get<DatabaseConfig>(DATABASE_CONFIG_NAME);

        return {
          type: 'postgres',
          entities: [],
          ...options,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
