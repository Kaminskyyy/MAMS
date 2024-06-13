import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from 'src/database/entities/auction.entity';
import { Participant } from 'src/database/entities/participant.entity';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { AuctionCreate } from './interfaces/auction-create.interface';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepo: Repository<Auction>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
  ) {}

  async create(auction: AuctionCreate) {
    const participantsEntities = auction.participants.map((participantPlain) =>
      this.participantRepo.create({
        ...participantPlain,
      }),
    );

    const results = await Promise.allSettled(
      participantsEntities.map((participantEntity) => participantEntity.save()),
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        throw new Error(
          `error during saving participant ${participantsEntities[index]}`,
        );
      }
    });

    const auctionEntity = this.auctionRepo.create({
      ...auction,
      participants: participantsEntities,
    });

    await auctionEntity.save();
    return auctionEntity;
  }

  async findManyByItemId(itemsIds: number[]) {
    const where: FindOptionsWhere<Auction> = { itemId: In(itemsIds) };
    return this.auctionRepo.find({
      where,
      relations: {
        participants: true,
      },
    });
  }
}
