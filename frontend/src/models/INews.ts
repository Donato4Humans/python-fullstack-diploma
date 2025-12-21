import type {IVenue} from "./IVenue";

export interface INews {
  id: number;
  title: string;
  content: string;
  type: string;
  is_paid: boolean;
  photo?: string | null;
  venue_id?: number | null; // only for request
  venue_title?: string | null; // only response
  venue?: IVenue | null; // only response
  created_at: string;
  updated_at: string;
}