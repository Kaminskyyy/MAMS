import { Inject, Injectable } from '@nestjs/common';
import { SELLER_SERVICE } from '../transport-config/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, map, timeout } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { ItemDto } from './dto/item.dto';
import { validateOrReject } from 'class-validator';
import { SellerMessagePattern } from 'src/common/patterns/seller-pattern.enum';
import { ItemStatusDto } from './dto/item-status.dto';

@Injectable()
export class ItemsService {
  constructor(
    @Inject(SELLER_SERVICE) private readonly sellerServiceClient: ClientProxy,
  ) {}

  async getById(itemId: number): Promise<ItemDto> {
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

  async getItemsStatuses(itemsIds: number[]): Promise<ItemStatusDto[]> {
    const results = await firstValueFrom(
      this.sellerServiceClient
        .send(SellerMessagePattern.GET_ITEMS_STATUSES, { itemsIds })
        .pipe(
          timeout(5000),
          map((value: any[]) => {
            return plainToInstance(ItemStatusDto, value);
          }),
        ),
    );

    for (const result of results) {
      await validateOrReject(result);
    }

    return results;
  }
}
