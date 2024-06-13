import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Participant } from './participant.entity';

@Entity()
export class Auction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemId: number;

  @Column()
  amountToPay: number;

  @OneToMany(() => Participant, (participant) => participant.auction)
  participants: Participant[];
}
