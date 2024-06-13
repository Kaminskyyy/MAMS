import { IsInt, IsNumber } from 'class-validator';

export class AuctionResultsDto {
  @IsInt()
  itemId: number;

  @IsNumber()
  amount: number;

  @IsInt()
  winnerId: number;
}
