import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HackernewsController } from './hackernews.controller';
import { HackernewsService } from './hackernews.service';

@Module({
  imports: [ConfigModule],
  controllers: [HackernewsController],
  providers: [HackernewsService],
})
export class HackernewsModule {}
