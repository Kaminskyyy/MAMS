import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { AUCTION_QUEUE } from 'src/transport-config/constants';
import { ItemDto } from '../common/dto/item.dto';
import { AuctionQueueJob } from 'src/common/patterns/auction-queue-job.enum';
import { ItemsService } from 'src/items/items.service';
import { ItemStatus } from 'src/common/types/item-status.enum';
import { AuctionService } from 'src/auction/auction.service';
import { AuctionResults } from './interfaces/auction-results.interface';

@Injectable()
export class ManagerService {
  constructor(
    @InjectQueue(AUCTION_QUEUE)
    private readonly auctionQueue: Queue,
    private readonly itemsService: ItemsService,
    private readonly auctionService: AuctionService,
  ) {}

  async scheduleAuction(itemDto: ItemDto) {
    const delay = new Date(itemDto.auctionDate).getTime() - Date.now() - 1000;

    this.auctionQueue.add(AuctionQueueJob.PREPARE_AUCTION, itemDto, {
      delay,
    });

    this.itemsService.setItemStatus(itemDto.id, ItemStatus.AUCTION_SCHEDULED);
  }

  async getAuctionsResults(itemsIds: number[]) {
    const auctions = await this.auctionService.findManyByItemId(itemsIds);

    const results: AuctionResults[] = auctions.map((auction) => {
      const winnerId = auction.participants.find(
        (participant) => participant.isWinner,
      ).bidderId;

      return {
        itemId: auction.itemId,
        amount: auction.amountToPay,
        winnerId,
      };
    });

    return results;
  }
}
