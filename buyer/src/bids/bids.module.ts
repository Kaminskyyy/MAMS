import { Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/database/entities/bid.entity';
import { ItemsModule } from 'src/items/items.module';
import { BidsValidationService } from './bids-validation.service';
import { BidsMicroserviceController } from './bids.microservice.controller';
import { AuctionModule } from 'src/auction/auction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bid]), ItemsModule, AuctionModule],
  controllers: [BidsController, BidsMicroserviceController],
  providers: [BidsService, BidsValidationService],
})
export class BidsModule {}
