import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from 'src/database/entities/bid.entity';
import { Repository } from 'typeorm';
import { BidDto } from './dto/bid.dto';
import { ItemsService } from 'src/microservice/items/items.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private readonly bidRepo: Repository<Bid>,
    private readonly itemsService: ItemsService,
  ) {}

  async create(bidDto: BidDto) {
    // Retrieve item
    const item = await this.itemsService.getById(bidDto.itemId);

    console.log(item);
    // Check bid validity

    // Save bid

    return item;
  }
}
