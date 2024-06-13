import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { Currency } from 'src/database/entities/item.entity';

export class ItemDto {
  @IsInt()
  categoryId: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  minBidders: number;

  @IsNumber()
  minBid: number;

  @IsEnum(Currency)
  auctionCurrency: Currency;
}
