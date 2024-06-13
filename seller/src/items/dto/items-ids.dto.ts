import { IsArray, IsInt } from 'class-validator';

export class ItemsIdsDto {
  @IsArray()
  @IsInt({ each: true })
  itemsIds: number[];
}
