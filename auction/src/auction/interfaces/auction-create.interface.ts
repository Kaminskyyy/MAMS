import { ParticipantCreate } from './participant-create.interface';

export interface AuctionCreate {
  itemId: number;
  amountToPay: number;
  participants: ParticipantCreate[];
}
