import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Currency } from 'src/common/types/currency.enum';
import { ItemStatus } from 'src/common/types/item-status.enum';

export class ItemDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  sellerId: number;

  @IsInt()
  minBidders: number;

  @IsNumber()
  minBid: number;

  @IsEnum(Currency)
  auctionCurrency: Currency;

  @IsOptional()
  @IsDateString()
  auctionDate?: Date;

  @IsEnum(ItemStatus)
  status: ItemStatus;
}
