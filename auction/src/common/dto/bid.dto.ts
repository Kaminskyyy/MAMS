import { IsEnum, IsInt, IsNumber } from 'class-validator';
import { Currency } from '../types/currency.enum';

export class BidDto {
  @IsInt()
  id: number;

  @IsNumber()
  bid: number;

  @IsEnum(Currency)
  bidCurrency: Currency;

  @IsInt()
  itemId: number;

  @IsInt()
  bidderId: number;
}
