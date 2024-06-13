import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auction } from './auction.entity';

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bidderId: number;

  @Column()
  isWinner: boolean;

  @ManyToOne(() => Auction, (auction) => auction.participants)
  auction: Auction;
}
