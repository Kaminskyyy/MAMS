import { IsEnum, IsInt, IsNumber } from 'class-validator';
import { Currency } from 'src/database/entities/bid.entity';

export class BidDto {
  @IsNumber()
  bid: number;

  @IsEnum(Currency)
  bidCurrency: Currency;

  @IsInt()
  itemId: number;
}
