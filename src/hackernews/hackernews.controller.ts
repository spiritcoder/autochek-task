import { Controller, Get } from '@nestjs/common';
import { HackernewsService } from './hackernews.service';
import { ResponseData } from './interfaces/hackernews.interface';
@Controller('hackernews')
export class HackernewsController {
  /**
   *
   */
  constructor(private readonly hackernewsService: HackernewsService) {}
  @Get('mostOccuringWordsInLast25Titles')
  async GetMostOccuringWordsInLast25Titles(): Promise<ResponseData> {
    const stringResult =
      await this.hackernewsService.getTop10OccuringWordsForLast25Stories();
    const response: ResponseData = {
      message:
        'Top 10 most occurring words in the titles of the last 25 stories',
      status: 200,
      data: stringResult,
    };
    return response;
  }

  @Get('mostOccuringWordsInLastWeekTitles')
  async GetMostOccuringWordsInLastWeekTitles(): Promise<ResponseData> {
    const stringResult =
      await this.hackernewsService.getTop10OccuringWordsForLastWeekArticles();
    const response: ResponseData = {
      message:
        'Top 10 most occurring words in the titles of the post of exactly the last week',
      status: 200,
      data: stringResult,
    };
    return response;
  }

  @Get('mostOccuringWordsInLast600StoriesOfUser')
  async GetMostOccuringWordsInLast600StoriesOfUser(): Promise<ResponseData> {
    const stringResult =
      await this.hackernewsService.getTop10OccuringWordsForLast600StoriesOfUsersWithMoreThan10Karma();
    const response: ResponseData = {
      message:
        'Top 10 most occurring words in titles of the last 600 stories of users with at least 10.000 karma',
      status: 200,
      data: stringResult,
    };
    return response;
  }
}
