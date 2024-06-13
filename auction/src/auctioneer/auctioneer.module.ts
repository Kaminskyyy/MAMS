import { Module } from '@nestjs/common';
import { AuctioneerService } from './auctioneer.service';
import { BullModule } from '@nestjs/bull';
import { AUCTION_QUEUE } from 'src/transport-config/constants';
import { AuctioneerConsumerService } from './auctioneer.consumer.service';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [BullModule.registerQueue({ name: AUCTION_QUEUE }), ItemsModule],
  providers: [AuctioneerService, AuctioneerConsumerService],
})
export class AuctioneerModule {}
