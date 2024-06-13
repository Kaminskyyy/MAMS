import { Currency } from 'src/common/types/currency.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bid extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bid: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  bidCurrency: Currency;

  @Column()
  itemId: number;

  @Column()
  bidderId: number;
}
