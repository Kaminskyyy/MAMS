import { Test, TestingModule } from '@nestjs/testing';
import { TransportConfigService } from './client-proxy-factory-wrapper.service';

describe('TransportConfigService', () => {
  let service: TransportConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportConfigService],
    }).compile();

    service = module.get<TransportConfigService>(TransportConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
