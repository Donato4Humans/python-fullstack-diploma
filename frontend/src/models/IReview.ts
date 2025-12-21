import type {IUser} from "./IUser";

export interface IReview {
  id: number;
  venue: number;
  venue_title: string;
  author: IUser;
  author_name: string;
  rating: number;
  text?: string;
  is_critic_review: boolean;
  created_at: string;
  updated_at: string;
}