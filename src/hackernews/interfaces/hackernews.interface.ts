export interface User {
  id: string;
  about: string;
  karma: number;
  created: number;
  submitted: number[];
}

export interface Story {
  by: string;
  descendants: number;
  id: string;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

export interface ResponseData {
  status: number;
  message: string;
  data: string[];
}
