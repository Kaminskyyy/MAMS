import { IsEnum, IsInt, IsNumber, IsString, Matches } from 'class-validator';
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

  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  auctionDate: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: '$property must be formatted as hh:mm',
  })
  auctionTime: string;
}
