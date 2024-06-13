import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { ItemDto } from '../common/dto/item.dto';
import {
  AuctionEventPattern,
  AuctionMessagePattern,
} from 'src/common/patterns/auction-pattern.enum';
import { ManagerService } from './manager.service';
import { ItemsIdsDto } from 'src/common/dto/items-ids.dto';
import { AuctionResults } from './interfaces/auction-results.interface';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@Controller()
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @EventPattern(AuctionEventPattern.SCHEDULE_AUCTION)
  async scheduleAuction(itemDto: ItemDto): Promise<void> {
    this.managerService.scheduleAuction(itemDto);
  }

  @MessagePattern(AuctionMessagePattern.GET_AUCTIONS_RESULTS)
  async getAuctionsResults(
    itemsIdsDto: ItemsIdsDto,
  ): Promise<AuctionResults[]> {
    const results = await this.managerService.getAuctionsResults(
      itemsIdsDto.itemsIds,
    );

    return results;
  }
}
