import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
}

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
