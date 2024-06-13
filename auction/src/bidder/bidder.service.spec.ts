import { Test, TestingModule } from '@nestjs/testing';
import { BidderService } from './bidder.service';

describe('BidderService', () => {
  let service: BidderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidderService],
    }).compile();

    service = module.get<BidderService>(BidderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
