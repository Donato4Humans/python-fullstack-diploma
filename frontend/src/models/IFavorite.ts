import type {IVenue} from "./IVenue";

export interface IFavorite {
  id: number;
  venue: IVenue;
  venue_id: number;
  created_at: string;
}