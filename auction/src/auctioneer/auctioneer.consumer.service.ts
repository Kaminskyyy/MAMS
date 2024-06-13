import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { ItemDto } from 'src/common/dto/item.dto';
import { AuctionQueueJob } from 'src/common/patterns/auction-queue-job.enum';
import { ItemStatus } from 'src/common/types/item-status.enum';
import { ItemsService } from 'src/items/items.service';
import { AUCTION_QUEUE } from 'src/transport-config/constants';
import { AuctioneerService } from './auctioneer.service';
import { Queue } from 'bull';
import { BidDto } from 'src/common/dto/bid.dto';
import { AuctionFinishDto } from 'src/common/dto/auction-finish.dto';

@Processor(AUCTION_QUEUE)
export class AuctioneerConsumerService {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly auctioneerService: AuctioneerService,
    @InjectQueue(AUCTION_QUEUE) private readonly auctionQueue: Queue,
  ) {}

  @Process(AuctionQueueJob.START_AUCTION)
  startAuction({ data: itemDto }: { data: ItemDto }): void {
    this.itemsService.setItemStatus(itemDto.id, ItemStatus.AUCTION_STARTED);
    this.auctionQueue.add(AuctionQueueJob.GET_BIDS, itemDto.id);
  }

  @Process(AuctionQueueJob.CONDUCT_AUCTION)
  conductAuction({ data: bids }: { data: BidDto[] }): void {
    console.log('CONDUCT AUCTION', bids);

    bids.sort((a, b) => {
      return b.bid - a.bid;
    });

    const winnerId = bids[0].bidderId;
    const amountToPay = bids[1].bid;
    const itemId = bids[0].itemId;
    const participantsIds = bids.map((bid) => bid.bidderId);

    console.log('WINNER', bids[0]);
    console.log('AMOUNT TO PAY', amountToPay);

    const jobData: AuctionFinishDto = {
      itemId,
      amountToPay,
      winnerId,
      participantsIds,
    };
    this.auctionQueue.add(AuctionQueueJob.FINISH_AUCTION, jobData);
  }
}
