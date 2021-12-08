import { Test, TestingModule } from '@nestjs/testing';
import { HackernewsController } from './hackernews.controller';

describe('HackernewsController', () => {
  let controller: HackernewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HackernewsController],
    }).compile();

    controller = module.get<HackernewsController>(HackernewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
