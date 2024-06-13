import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BidsService } from './bids.service';
import { BuyerPattern } from 'src/common/patterns/buyer-pattern.enum';
import { Bid } from 'src/database/entities/bid.entity';

@Controller()
export class BidsMicroserviceController {
  constructor(private readonly bidsService: BidsService) {}

  @MessagePattern(BuyerPattern.GET_ITEM_BIDS_COUNT)
  async getItemBidsCount(itemId: number): Promise<number> {
    return this.bidsService.countItemBids(itemId);
  }

  @MessagePattern(BuyerPattern.GET_ITEM_BIDS)
  async getItemBids(itemId: number): Promise<Bid[]> {
    return this.bidsService.findBidsByItemId(itemId);
  }
}
