import { Matches } from 'class-validator';

export class ItemScheduleAuctionDto {
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  auctionDate: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: '$property must be formatted as hh:mm',
  })
  auctionTime: string;
}
