import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { BullModule } from '@nestjs/bull';
import { AUCTION_QUEUE } from 'src/transport-config/constants';
import { ManagerConsumerService } from './manager.consumer.service';
import { TransportConfigModule } from 'src/transport-config/transport-config.module';
import { ItemsModule } from 'src/items/items.module';
import { BidsModule } from 'src/bids/bids.module';
import { AuctionModule } from 'src/auction/auction.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: AUCTION_QUEUE,
    }),
    TransportConfigModule,
    ItemsModule,
    BidsModule,
    AuctionModule,
  ],
  providers: [ManagerService, ManagerConsumerService],
  controllers: [ManagerController],
})
export class ManagerModule {}
