import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { AuctionQueueJob } from 'src/common/patterns/auction-queue-job.enum';
import { AUCTION_QUEUE } from 'src/transport-config/constants';
import { ItemDto } from '../common/dto/item.dto';
import { ItemsService } from 'src/items/items.service';
import { BidsService } from 'src/bids/bids.service';
import { ItemStatus } from 'src/common/types/item-status.enum';
import { Queue } from 'bull';
import { AuctionFinishDto } from 'src/common/dto/auction-finish.dto';
import { AuctionService } from 'src/auction/auction.service';
import { AuctionCreate } from 'src/auction/interfaces/auction-create.interface';
import { ParticipantCreate } from 'src/auction/interfaces/participant-create.interface';

@Processor(AUCTION_QUEUE)
export class ManagerConsumerService {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly bidsService: BidsService,
    private readonly auctionService: AuctionService,
    @InjectQueue(AUCTION_QUEUE) private readonly auctionQueue: Queue,
  ) {}

  @Process(AuctionQueueJob.PREPARE_AUCTION)
  async startAuction({ data: itemDto }: { data: ItemDto }): Promise<void> {
    const item = await this.itemsService.findById(itemDto.id);
    if (!item) {
      throw new Error('item not found');
    }

    const bidsNum = await this.bidsService.getItemBidsCount(itemDto.id);

    if (bidsNum < item.minBidders) {
      this.itemsService.setItemStatus(
        item.id,
        ItemStatus.AUCTION_CANCELLED_INSUFFICIENT_BIDS,
      );

      return;
    }

    this.auctionQueue.add(AuctionQueueJob.START_AUCTION, item);
  }

  @Process(AuctionQueueJob.FINISH_AUCTION)
  async finishAuction({
    data: auctionFinishDto,
  }: {
    data: AuctionFinishDto;
  }): Promise<void> {
    console.log('AUCTION FINISH', auctionFinishDto);

    const itemId = auctionFinishDto.itemId;
    const amountToPay = auctionFinishDto.amountToPay;
    const participants: ParticipantCreate[] =
      auctionFinishDto.participantsIds.map((participantId) => {
        return {
          bidderId: participantId,
          isWinner: participantId === auctionFinishDto.winnerId,
        };
      });

    const auction: AuctionCreate = {
      itemId,
      amountToPay,
      participants,
    };

    await this.auctionService.create(auction);
    await this.itemsService.setItemStatus(itemId, ItemStatus.AUCTION_FINISHED);
  }
}
