import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BidPattern } from 'src/common/patterns/patterns';
import { ItemsService } from './items.service';

@Controller()
export class ItemsMicroserviceController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern(BidPattern.GET_ITEM)
  find(itemId: number) {
    return this.itemsService.findById(itemId);
  }
}
