import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { firstValueFrom, map, timeout } from 'rxjs';
import { AuctionMessagePattern } from 'src/common/patterns/auction-pattern.enum';
import { AUCTION_SERVICE } from 'src/transport-config/constants';
import { AuctionResultsDto } from './dto/auction-results.dto';

@Injectable()
export class AuctionService {
  constructor(
    @Inject(AUCTION_SERVICE) private readonly auctionServiceClient: ClientProxy,
  ) {}

  async getAuctionsResults(itemsIds: number[]): Promise<AuctionResultsDto[]> {
    const results = await firstValueFrom(
      this.auctionServiceClient
        .send(AuctionMessagePattern.GET_AUCTIONS_RESULTS, { itemsIds })
        .pipe(
          timeout(5000),
          map((value: any[]) => {
            return plainToInstance(AuctionResultsDto, value);
          }),
        ),
    );

    for (const result of results) {
      await validateOrReject(result);
    }

    return results;
  }
}
