import { ItemStatus } from 'src/common/types/item-status.enum';

export class ItemSetStatusDto {
  itemId: number;

  newStatus: ItemStatus;
}
