import { IsArray, IsInt, IsNumber } from 'class-validator';

export class AuctionFinishDto {
  @IsInt()
  itemId: number;

  @IsNumber()
  amountToPay: number;

  @IsInt()
  winnerId: number;

  @IsInt({ each: true })
  @IsArray()
  participantsIds: number[];
}
