import { Module } from '@nestjs/common';
import { BidderService } from './bidder.service';
import { BidderConsumerService } from './bidder.consumer.service';
import { BidsModule } from 'src/bids/bids.module';
import { BullModule } from '@nestjs/bull';
import { AUCTION_QUEUE } from 'src/transport-config/constants';

@Module({
  imports: [BidsModule, BullModule.registerQueue({ name: AUCTION_QUEUE })],
  providers: [BidderService, BidderConsumerService],
})
export class BidderModule {}
