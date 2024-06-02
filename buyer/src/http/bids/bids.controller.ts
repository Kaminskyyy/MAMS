import { Body, Controller, Post } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidDto } from './dto/bid.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  async create(@Body() body: BidDto) {
    return this.bidsService.create(body);
  }
}
