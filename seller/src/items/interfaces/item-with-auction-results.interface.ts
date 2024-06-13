import { AuctionResultsDto } from 'src/auctions/dto/auction-results.dto';
import { Currency, ItemStatus } from 'src/database/entities/item.entity';

export interface ItemWithAuctionResults {
  id: number;
  name: string;
  description: string;
  sellerId: number;
  minBidders: number;
  minBid: number;
  auctionCurrency: Currency;
  auctionDate: Date;
  status: ItemStatus;
  auctionResult: Omit<AuctionResultsDto, 'itemId'>;
}
