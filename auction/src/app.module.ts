import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManagerModule } from './manager/manager.module';
import { BullModule } from '@nestjs/bull';
import { TransportConfigModule } from './transport-config/transport-config.module';
import { QueueConfigService } from './transport-config/queue-config.service';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { BidsModule } from './bids/bids.module';
import { AuctioneerModule } from './auctioneer/auctioneer.module';
import { BidderModule } from './bidder/bidder.module';
import databaseConfig from './config/database.config';
import rabbitmqConfig from './config/rabbitmq.config';
import redisConfig from './config/redis.config';
import { DatabaseModule } from './database/database.module';
import { AuctionModule } from './auction/auction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [databaseConfig, rabbitmqConfig, redisConfig],
    }),
    ManagerModule,
    AuctioneerModule,
    BullModule.forRootAsync({
      imports: [TransportConfigModule],
      useFactory: (queueConfigService: QueueConfigService) =>
        queueConfigService.getQueueConfig(),
      inject: [QueueConfigService],
    }),
    ItemsModule,
    BidsModule,
    BidderModule,
    DatabaseModule,
    AuctionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
