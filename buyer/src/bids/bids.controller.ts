import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidDto } from './dto/bid.dto';
import { RequestHeader } from 'src/common/decorators/request-header.decorator';
import { XUserHeaders } from 'src/common/dto/x-user-headers.dto';
import { BidUpdateDto } from './dto/bid.update.dto';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  async create(
    @RequestHeader(XUserHeaders) xUserHeaders: XUserHeaders,
    @Body() body: BidDto,
  ) {
    return this.bidsService.create(body, xUserHeaders['X-User-Id']);
  }

  @Get()
  async find(@RequestHeader(XUserHeaders) xUserHeaders: XUserHeaders) {
    return this.bidsService.findBidsByBidderId(xUserHeaders['X-User-Id']);
  }

  @Patch('/:id')
  async update(
    @RequestHeader(XUserHeaders) xUserHeaders: XUserHeaders,
    @Param('id') bidId: number,
    @Body() body: BidUpdateDto,
  ) {
    return this.bidsService.updateBid(xUserHeaders['X-User-Id'], bidId, body);
  }

  @Delete('/:id')
  async remove(
    @RequestHeader(XUserHeaders) xUserHeaders: XUserHeaders,
    @Param('id') bidId: number,
  ) {
    return this.bidsService.remove(xUserHeaders['X-User-Id'], bidId);
  }
}
