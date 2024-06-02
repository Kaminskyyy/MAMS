import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

export enum ItemStatus {
  ITEM_CREATED = 'item_created',
  AUCTION_SCHEDULED = 'auction_scheduled',
  AUCTION_STARTED = 'auction_started',
  AUCTION_FINISHED = 'auction_finished',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
}

@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.items)
  category: Category;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  sellerId: number;

  @Column({ default: 1 })
  minBidders: number;

  @Column({ default: 0 })
  minBid: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  auctionCurrency: Currency;

  @Column()
  auctionDate: Date;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.ITEM_CREATED,
  })
  status: ItemStatus;
}
