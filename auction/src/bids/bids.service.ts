import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { catchError, firstValueFrom, lastValueFrom, map, timeout } from 'rxjs';
import { BidDto } from 'src/common/dto/bid.dto';
import { BuyerPattern } from 'src/common/patterns/buyer-pattern.enum';
import { BUYER_SERVICE } from 'src/transport-config/constants';

@Injectable()
export class BidsService {
  constructor(
    @Inject(BUYER_SERVICE) private readonly buyerServiceClient: ClientProxy,
  ) {}

  async getItemBidsCount(itemId: number): Promise<number> {
    return firstValueFrom(
      this.buyerServiceClient
        .send(BuyerPattern.GET_ITEM_BIDS_COUNT, itemId)
        .pipe(timeout(5000))
        .pipe(
          map((value) => {
            if (typeof value !== 'number') {
              throw new Error('invalid data type');
            }
            return value;
          }),
          catchError((err) => {
            console.error('Error:', err);
            throw err;
          }),
        ),
    );
  }

  async getItemBids(itemId: number) {
    const bids: BidDto[] = await lastValueFrom(
      this.buyerServiceClient.send(BuyerPattern.GET_ITEM_BIDS, itemId).pipe(
        timeout(5000),
        map((value: any[]) => {
          return plainToInstance(BidDto, value);
        }),
      ),
    );

    for (const bid of bids) {
      await validateOrReject(bid);
    }

    return bids;
  }
}
