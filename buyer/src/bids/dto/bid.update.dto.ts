import { IsNumber } from 'class-validator';

export class BidUpdateDto {
  @IsNumber()
  newBid: number;
}
