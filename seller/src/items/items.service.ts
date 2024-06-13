import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item, ItemStatus } from 'src/database/entities/item.entity';
import { FindOptionsSelect, FindOptionsWhere, In, Repository } from 'typeorm';
import { ItemDto } from './dto/item.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { RpcException } from '@nestjs/microservices';
import { ItemSetStatusDto } from './dto/item-set-status.dto';
import { ItemScheduleAuctionDto } from './dto/item-schedule-auction.dto';
import { AuctionsService } from 'src/auctions/auctions.service';
import { ItemWithAuctionResults } from './interfaces/item-with-auction-results.interface';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    private readonly categoriesService: CategoriesService,
    private readonly auctionsService: AuctionsService,
  ) {}

  // TODO: validate item!
  async create(itemDto: ItemDto, userId: number): Promise<Item> {
    const category = await this.categoriesService.findOne(itemDto.categoryId);
    if (!category) throw new BadRequestException('unknown category');

    const item = this.itemRepo.create({
      category: category,
      name: itemDto.name,
      description: itemDto.description,
      minBidders: itemDto.minBidders,
      minBid: itemDto.minBid,
      auctionCurrency: itemDto.auctionCurrency,
      sellerId: userId,
    });
    await item.save();

    return item;
  }

  // TODO: validate time data!
  async scheduleAuction(
    sellerId: number,
    itemId: number,
    itemScheduleAuctionDto: ItemScheduleAuctionDto,
  ) {
    const where: FindOptionsWhere<Item> = { id: itemId, sellerId };
    const item = await this.itemRepo.findOne({ where });
    if (!item) {
      throw new NotFoundException('item not found');
    }

    const [year, month, day] = itemScheduleAuctionDto.auctionDate
      .split('-')
      .map((value) => +value);
    const [hours, minutes] = itemScheduleAuctionDto.auctionTime
      .split(':')
      .map((value) => +value);

    const auctionDate = new Date(year, month - 1, day, hours, minutes);

    item.auctionDate = auctionDate;
    await item.save();

    this.auctionsService.scheduleAuction(item);
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepo.find();
  }

  async findById(itemId: number): Promise<Item> {
    const where: FindOptionsWhere<Item> = { id: itemId };
    return this.itemRepo.findOne({ where });
  }

  async findBySellerId(
    sellerId: number,
  ): Promise<(ItemWithAuctionResults | Item)[]> {
    const where: FindOptionsWhere<Item> = { sellerId: sellerId };
    const items = await this.itemRepo.find({ where });

    const finishedAuctionsIds = items
      .filter(
        (item) =>
          item.status === ItemStatus.AUCTION_FINISHED ||
          item.status === ItemStatus.AUCTION_CANCELLED_INSUFFICIENT_BIDS,
      )
      .map((item) => item.id);

    const auctionsResults =
      await this.auctionsService.getAuctionsResults(finishedAuctionsIds);

    const itemsWithResults = items.map((item) => {
      const auctionResult = auctionsResults.find(
        (auctionResult) => auctionResult.itemId === item.id,
      );

      if (!auctionResult) return item;

      return {
        ...item,
        auctionResult: {
          amount: auctionResult.amount,
          winnerId: auctionResult.winnerId,
        },
      };
    });

    return itemsWithResults;
  }

  async findByCategoryId(categoryId: number): Promise<Item[]> {
    const category = await this.categoriesService.findOne(categoryId);
    if (!category) throw new BadRequestException('unknown category');

    const where: FindOptionsWhere<Item> = { category };
    return this.itemRepo.find({ where });
  }

  async findItemsStatuses(itemsIds: number[]) {
    const where: FindOptionsWhere<Item> = { id: In(itemsIds) };
    const select: FindOptionsSelect<Item> = { status: true, id: true };

    return this.itemRepo.find({
      where,
      select,
    });
  }

  async setStatus(itemSetStatusDto: ItemSetStatusDto): Promise<void> {
    const item = await this.findById(itemSetStatusDto.itemId);
    if (!item) {
      throw new RpcException('item not found');
    }

    item.status = itemSetStatusDto.newStatus;

    await item.save();
  }
}
