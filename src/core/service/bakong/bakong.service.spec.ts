import { Test, TestingModule } from '@nestjs/testing';
import { BakongService } from './bakong.service';

describe('BakongService', () => {
  let service: BakongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BakongService],
    }).compile();

    service = module.get<BakongService>(BakongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});