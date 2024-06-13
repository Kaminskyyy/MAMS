import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { AUCTION_QUEUE } from 'src/transport-config/constants';

@Injectable()
export class AuctioneerService {
  constructor(
    @InjectQueue(AUCTION_QUEUE) private readonly auctionQueue: Queue,
  ) {}

  getItemBids(): void {}
}
