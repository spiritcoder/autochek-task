import { Test, TestingModule } from '@nestjs/testing';
import { HackernewsService } from './hackernews.service';

describe('HackernewsService', () => {
  let service: HackernewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HackernewsService],
    }).compile();

    service = module.get<HackernewsService>(HackernewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
