import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue } from 'bull';
import { BidsService } from 'src/bids/bids.service';
import { AuctionQueueJob } from 'src/common/patterns/auction-queue-job.enum';
import { AUCTION_QUEUE } from 'src/transport-config/constants';

@Processor(AUCTION_QUEUE)
export class BidderConsumerService {
  constructor(
    private readonly bidsService: BidsService,
    @InjectQueue(AUCTION_QUEUE) private readonly auctionQueue: Queue,
  ) {}

  @Process(AuctionQueueJob.GET_BIDS)
  async sendBids({ data: itemId }: { data: number }): Promise<void> {
    const bids = await this.bidsService.getItemBids(itemId);
    this.auctionQueue.add(AuctionQueueJob.CONDUCT_AUCTION, bids);
  }
}
