import { IsEnum, IsInt } from 'class-validator';
import { ItemStatus } from 'src/common/types/item-status.enum';

export class ItemStatusDto {
  @IsInt()
  id: number;

  @IsEnum(ItemStatus)
  status: ItemStatus;
}
