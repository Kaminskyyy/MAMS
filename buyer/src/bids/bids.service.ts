import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/database/entities/bid.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BidDto } from './dto/bid.dto';
import { BidUpdateDto } from './dto/bid.update.dto';
import { ItemsService } from 'src/items/items.service';
import { BidsValidationService } from './bids-validation.service';
import { ItemStatus } from 'src/common/types/item-status.enum';
import { AuctionService } from 'src/auction/auction.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private readonly bidRepo: Repository<Bid>,
    private readonly itemsService: ItemsService,
    private readonly bidsValidationService: BidsValidationService,
    private readonly auctionService: AuctionService,
  ) {}

  async create(bidDto: BidDto, bidderId: number): Promise<Bid> {
    const existingBid = await this.findBidByItemIdAndBidderId(
      bidDto.itemId,
      bidderId,
    );
    if (existingBid) {
      throw new BadRequestException('only one bid per item allowed');
    }

    const item = await this.itemsService.getById(bidDto.itemId);
    if (!item) {
      throw new NotFoundException('item not found');
    }

    this.bidsValidationService.validateBidTime(item);
    this.bidsValidationService.validateSellerBidder(item.sellerId, bidderId);
    this.bidsValidationService.validateBidCurrency(
      item.auctionCurrency,
      bidDto.bidCurrency,
    );
    this.bidsValidationService.validateBidAmount(item.minBid, bidDto.bid);

    const bid = this.bidRepo.create({ ...bidDto, bidderId });
    await bid.save();
    return bid;
  }

  async findBidByItemIdAndBidderId(
    itemId: number,
    bidderId: number,
  ): Promise<Bid> {
    const where: FindOptionsWhere<Bid> = { itemId, bidderId };
    return this.bidRepo.findOne({ where });
  }

  async findBidsByBidderId(bidderId: number) {
    const where: FindOptionsWhere<Bid> = { bidderId };
    const bids = await this.bidRepo.find({ where });

    const itemsIds = bids.map((bid) => bid.itemId);
    const itemsStatuses = await this.itemsService.getItemsStatuses(itemsIds);
    console.log(itemsStatuses);

    const finishedItemAuctions = itemsStatuses.filter(
      (itemStatus) =>
        itemStatus.status === ItemStatus.AUCTION_FINISHED ||
        itemStatus.status === ItemStatus.AUCTION_CANCELLED_INSUFFICIENT_BIDS,
    );
    const finishedAuctionsItemsIds = finishedItemAuctions.map(
      (itemAuction) => itemAuction.id,
    );

    const auctionsResultsDto = await this.auctionService.getAuctionsResults(
      finishedAuctionsItemsIds,
    );

    const bidsWithResults = bids.map((bid) => {
      const auctionResultDto = auctionsResultsDto.find(
        (auctionResult) => auctionResult.itemId === bid.itemId,
      );
      if (!auctionResultDto) return bid;

      const isWinner = auctionResultDto.winnerId === bid.bidderId;

      const auctionResult: any = {
        isWinner,
      };
      if (isWinner) {
        auctionResult.amount = auctionResultDto.amount;
      }
      return {
        ...bid,
        auctionResult,
      };
    });

    return bidsWithResults;
  }

  async updateBid(bidderId: number, bidId: number, bidUpdateDto: BidUpdateDto) {
    const where: FindOptionsWhere<Bid> = { id: bidId, bidderId };
    const bid = await this.bidRepo.findOne({ where });
    if (!bid) {
      throw new NotFoundException('bid not found');
    }

    const item = await this.itemsService.getById(bid.itemId);
    if (!item) {
      throw new NotFoundException('item not found');
    }

    this.bidsValidationService.validateBidTime(item);
    this.bidsValidationService.validateBidAmount(
      item.minBid,
      bidUpdateDto.newBid,
    );

    bid.bid = bidUpdateDto.newBid;

    await bid.save();
    return bid;
  }

  async remove(bidderId: number, bidId: number) {
    const where: FindOptionsWhere<Bid> = { id: bidId, bidderId };
    const bid = await this.bidRepo.findOne({ where });
    if (!bid) {
      throw new NotFoundException('bid not found');
    }

    await this.bidRepo.remove(bid);
    return bid;
  }

  async countItemBids(itemId: number): Promise<number> {
    const where: FindOptionsWhere<Bid> = { itemId };
    return this.bidRepo.countBy(where);
  }

  async findBidsByItemId(itemId: number): Promise<Bid[]> {
    const where: FindOptionsWhere<Bid> = { itemId };
    return this.bidRepo.find({ where });
  }
}
