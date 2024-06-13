import { IsDateString, IsEnum, IsInt, IsNumber } from 'class-validator';
import { ItemStatus } from 'src/common/types/item-status.enum';

export class ItemDto {
  @IsInt()
  id: number;

  @IsInt()
  sellerId: number;

  @IsInt()
  minBidders: number;

  @IsNumber()
  minBid: number;

  @IsDateString()
  auctionDate: Date;

  @IsEnum(ItemStatus)
  status: ItemStatus;
}
