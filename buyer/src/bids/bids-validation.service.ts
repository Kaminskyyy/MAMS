import { BadRequestException, Injectable } from '@nestjs/common';
import { Currency } from 'src/common/types/currency.enum';
import { ItemStatus } from 'src/common/types/item-status.enum';
import { ItemDto } from 'src/items/dto/item.dto';

@Injectable()
export class BidsValidationService {
  validateBidTime(item: ItemDto): void {
    if (item.status !== ItemStatus.AUCTION_SCHEDULED) {
      throw new BadRequestException('bidding are not allowed');
    }

    const auctionTimeWithOffset = new Date(
      new Date(item.auctionDate).getTime() - 1000 * 60 * 10,
    );
    const now = new Date();
    if (now > auctionTimeWithOffset) {
      throw new BadRequestException('bidding are not allowed anymore');
    }
  }

  validateBidCurrency(auctionCurrency: Currency, bidCurrency: Currency): void {
    if (auctionCurrency !== bidCurrency) {
      throw new BadRequestException('incorrect currency');
    }
  }

  validateBidAmount(minBid: number, bidAmount: number): void {
    if (minBid > bidAmount) {
      throw new BadRequestException('too low bid');
    }
  }

  validateSellerBidder(sellerId: number, bidderId: number) {
    if (sellerId === bidderId) {
      throw new BadRequestException('own item');
    }
  }
}
