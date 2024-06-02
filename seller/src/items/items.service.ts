import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/database/entities/item.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ItemDto } from './dto/item.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(itemDto: ItemDto, userId: number): Promise<Item> {
    const [year, month, day] = itemDto.auctionDate
      .split('-')
      .map((value) => +value);
    const [hours, minutes] = itemDto.auctionTime
      .split(':')
      .map((value) => +value);

    const auctionDate = new Date(year, month - 1, day, hours, minutes);

    const category = await this.categoriesService.findOne(itemDto.categoryId);
    if (!category) throw new BadRequestException('unknown category');

    const item = this.itemRepo.create({
      category: category,
      name: itemDto.name,
      description: itemDto.description,
      minBidders: itemDto.minBidders,
      minBid: itemDto.minBid,
      auctionCurrency: itemDto.auctionCurrency,
      auctionDate: auctionDate,
      sellerId: userId,
    });

    await item.save();

    return item;
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepo.find();
  }

  async findById(itemId: number): Promise<Item> {
    const where: FindOptionsWhere<Item> = { id: itemId };
    return this.itemRepo.findOne({ where });
  }

  async findBySellerId(sellerId: number): Promise<Item[]> {
    const where: FindOptionsWhere<Item> = { sellerId: sellerId };
    return this.itemRepo.find({ where });
  }

  async findByCategoryId(categoryId: number): Promise<Item[]> {
    const category = await this.categoriesService.findOne(categoryId);
    if (!category) throw new BadRequestException('unknown category');

    const where: FindOptionsWhere<Item> = { category };
    return this.itemRepo.find({ where });
  }
}
