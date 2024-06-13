import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { firstValueFrom, map, timeout } from 'rxjs';
import { ItemDto } from 'src/common/dto/item.dto';
import {
  SellerEventPattern,
  SellerMessagePattern,
} from 'src/common/patterns/seller-pattern.enum';
import { ItemStatus } from 'src/common/types/item-status.enum';
import { SELLER_SERVICE } from 'src/transport-config/constants';
import { ItemSetStatusDto } from './dto/item-set-status.dto';

@Injectable()
export class ItemsService {
  constructor(
    @Inject(SELLER_SERVICE) private readonly sellerServiceClient: ClientProxy,
  ) {}

  async findById(itemId: number): Promise<ItemDto> {
    return firstValueFrom(
      this.sellerServiceClient
        .send(SellerMessagePattern.GET_ITEM, itemId)
        .pipe(timeout(5000))
        .pipe(
          map(async (value) => {
            if (!value) return null;
            const instance = plainToInstance(ItemDto, value);
            await validateOrReject(instance, { whitelist: true });
            return instance;
          }),
        ),
    );
  }

  setItemStatus(itemId: number, newStatus: ItemStatus): void {
    const itemSetStatusDto: ItemSetStatusDto = { itemId, newStatus };

    this.sellerServiceClient.emit(
      SellerEventPattern.SET_ITEM_STATUS,
      itemSetStatusDto,
    );
  }
}
