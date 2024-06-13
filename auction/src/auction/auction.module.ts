import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from 'src/database/entities/participant.entity';
import { Auction } from 'src/database/entities/auction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Participant])],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
