import { Currency } from 'src/database/entities/bid.entity';

export enum ItemStatus {
  ITEM_CREATED = 'item_created',
  AUCTION_SCHEDULED = 'auction_scheduled',
  AUCTION_STARTED = 'auction_started',
  AUCTION_FINISHED = 'auction_finished',
}

export interface Item {
  id: number;

  name: string;

  description: string;

  sellerId: number;

  minBidders: number;

  minBid: number;

  auctionCurrency: Currency;

  auctionDate: Date;

  status: ItemStatus;
}
