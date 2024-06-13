import { IsEnum, IsInt } from 'class-validator';
import { ItemStatus } from 'src/database/entities/item.entity';

export class ItemSetStatusDto {
  @IsInt()
  itemId: number;

  @IsEnum(ItemStatus)
  newStatus: ItemStatus;
}
