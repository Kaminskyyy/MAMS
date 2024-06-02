import { Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/database/entities/bid.entity';
import { ItemsModule } from 'src/microservice/items/items.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bid]), ItemsModule],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
