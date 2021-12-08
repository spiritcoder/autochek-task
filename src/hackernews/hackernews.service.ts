import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { Story, User } from './interfaces/hackernews.interface';

@Injectable()
export class HackernewsService {
  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://hacker-news.firebaseio.com/v0/',
    });
  }

  async request(url: string): Promise<AxiosResponse<any, any>> {
    const result: any = await this.axiosInstance.get(url);
    return result;
  }

  async request2(url: string): Promise<AxiosResponse<any, any>> {
    return await (
      await this.axiosInstance.get(url)
    ).data;
  }

  async getStoryIds(): Promise<number[]> {
    const request = await this.request(`newstories.json?print=pretty`);
    const response = request.data;
    const numberArray: number[] = response;
    return numberArray;
  }

  async getTop10OccuringWordsForLast25Stories(): Promise<string[]> {
    const numberArray: number[] = await this.getStoryIds();
    const top25 = numberArray.slice(0, 25);
    const stories = await this.fetchBulkStories(top25);

    //map the stories and add their titles to an array
    const titleArray: string[] = stories.map((title) => title.title);

    const topWords: string[] = await this.top10OccuringWords(titleArray);
    return topWords;
  }

  async fetchBulkStories(pageIds: number[]): Promise<Story[]> {
    const fetchStories = await forkJoin(
      pageIds.map((pageId) => {
        return this.request2(`item/${pageId}.json?print=pretty`);
      }),
    )
      .pipe(take(1))
      .toPromise();
    const allStories: Story[] = JSON.parse(JSON.stringify(fetchStories));

    return allStories.filter((story) =>
      JSON.stringify(story).includes('title'),
    );
  }

  async getUserData(userIds: string[]): Promise<User[]> {
    const fetchUserData = await forkJoin(
      userIds.map((userId) => {
        return this.request2(`user/${userId}.json?print=pretty`);
      }),
    )
      .pipe(take(1))
      .toPromise();
    return JSON.parse(JSON.stringify(fetchUserData));
  }

  async getTop10OccuringWordsForLast600StoriesOfUsersWithMoreThan10Karma(): Promise<
    string[]
  > {
    const numberArray: number[] = await this.getStoryIds();
    const stories: Story[] = await this.fetchBulkStories(numberArray);

    //map the stories and add their creators to an array
    const storyAuthors: string[] = stories.map((story) => story.by);

    const fetchedAuthors: User[] = await this.getUserData(storyAuthors);

    //filter the ones with karma greater than 10
    const neededAuthorId = fetchedAuthors
      .filter((fetchedAuthor) => fetchedAuthor.karma >= 10)
      .map((id) => id.id);

    //get the stories whose authors are in the neededAuthors
    const neededStories = stories.filter((story) =>
      neededAuthorId.includes(story.by),
    );

    //get story titles
    const titleArray: string[] = neededStories.map((title) => title.title);

    const topWords: string[] = await this.top10OccuringWords(titleArray);
    return topWords;
  }

  async getTop10OccuringWordsForLastWeekArticles(): Promise<string[]> {
    //get today's date in seconds
    const presentDate = new Date();
    const presentDateSeconds = Math.floor(presentDate.getTime() / 1000);

    //get a week today's date in second
    const lastOneWeekDate = presentDate;
    lastOneWeekDate.setDate(lastOneWeekDate.getDate() - 7);
    const lastOneWeekSeconds = Math.floor(lastOneWeekDate.getTime() / 1000);

    //get all new stories
    const numberArray: number[] = await this.getStoryIds();
    const stories: Story[] = await this.fetchBulkStories(numberArray);

    //save the stories whose publish time falls between the seconds of today and exactly one week agao
    const storiesInWeek = stories.filter(
      (story) =>
        story.time >= lastOneWeekSeconds && story.time <= presentDateSeconds,
    );

    //Get the titles of the stories
    const titleArray: string[] = storiesInWeek.map(
      (storyInWeek) => storyInWeek.title,
    );

    const topWords: string[] = await this.top10OccuringWords(titleArray);
    return topWords;
  }

  async top10OccuringWords(titleArray: string[]): Promise<string[]> {
    // eslint-disable-next-line prefer-const
    let charObj = {};

    for (const val of titleArray) {
      const wordsInTitle = val.split(' ');
      for (let i = 0; i < wordsInTitle.length; i++) {
        const lowerCaseWord = wordsInTitle[i].toLowerCase();

        if (lowerCaseWord in charObj) {
          charObj[lowerCaseWord] += 1;
        } else {
          charObj[lowerCaseWord] = 1;
        }
      }
    }

    // eslint-disable-next-line prefer-const
    let letters = Object.keys(charObj).sort((a, b) => {
      if (charObj[a] == charObj[b]) {
        return a > b ? 1 : -1;
      }
      return charObj[b] - charObj[a];
    });

    return letters.slice(0, 10);
  }
}
