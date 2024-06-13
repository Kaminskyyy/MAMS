import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { ItemsService } from './items.service';
import {
  SellerEventPattern,
  SellerMessagePattern,
} from 'src/common/patterns/seller-pattern.enum';
import { Item } from 'src/database/entities/item.entity';
import { ItemSetStatusDto } from './dto/item-set-status.dto';
import { ItemsIdsDto } from './dto/items-ids.dto';

@Controller()
export class ItemsMicroserviceController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern(SellerMessagePattern.GET_ITEM)
  find(itemId: number): Promise<Item> {
    return this.itemsService.findById(itemId);
  }

  @MessagePattern(SellerMessagePattern.GET_ITEMS_STATUSES)
  getItemsStatuses(itemsIdsDto: ItemsIdsDto) {
    return this.itemsService.findItemsStatuses(itemsIdsDto.itemsIds);
  }

  @EventPattern(SellerEventPattern.SET_ITEM_STATUS)
  async setStatus(itemSetStatusDto: ItemSetStatusDto): Promise<void> {
    await this.itemsService.setStatus(itemSetStatusDto);
  }
}
