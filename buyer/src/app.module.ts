import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from './config/rabbitmq.config';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/database.config';
import { BidsModule } from './bids/bids.module';
import { ItemsModule } from './items/items.module';
import { AuctionModule } from './auction/auction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [databaseConfig, rabbitmqConfig],
    }),
    DatabaseModule,
    BidsModule,
    ItemsModule,
    AuctionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
