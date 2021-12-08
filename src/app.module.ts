import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HackernewsController } from './hackernews/hackernews.controller';
import { HackernewsModule } from './hackernews/hackernews.module';
import { HackernewsService } from './hackernews/hackernews.service';

@Module({
  imports: [HackernewsModule],
  controllers: [AppController, HackernewsController],
  providers: [AppService, HackernewsService],
})
export class AppModule {}
