import {IUser} from "./IUser";

export interface IComment {
  id: number;
  venue_title: string;
  author: IUser;
  author_name: string;
  text: string;
  is_moderated: boolean;
  created_at: string;
  updated_at: string;
}