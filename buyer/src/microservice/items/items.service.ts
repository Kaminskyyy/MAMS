import { Inject, Injectable } from '@nestjs/common';
import { SELLER_SERVICE } from '../transport-config/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BidPattern } from 'src/common/pattern';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemsService {
  constructor(
    @Inject(SELLER_SERVICE) private readonly sellerServiceClient: ClientProxy,
  ) {}

  async getById(itemId: number): Promise<Item> {
    return firstValueFrom(
      this.sellerServiceClient.send(BidPattern.GET_ITEM, itemId),
    );
  }
}
