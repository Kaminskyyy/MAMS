import { IsEnum, IsInt, IsNumber } from 'class-validator';
import { Currency } from 'src/common/types/currency.enum';

export class BidDto {
  @IsNumber()
  bid: number;

  @IsEnum(Currency)
  bidCurrency: Currency;

  @IsInt()
  itemId: number;
}
