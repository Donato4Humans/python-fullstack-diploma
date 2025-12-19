import type {IVenue} from "./IVenue";

export interface INews {
  id: number;
  title: string;
  content: string;
  photo: string | null;
  type: string;
  is_paid: boolean;
  venue: IVenue | null;
  venue_id?: number | null;
  venue_title: string | null;
  created_at: string;
  updated_at: string;
}