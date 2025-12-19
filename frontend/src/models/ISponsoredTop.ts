import type {IVenue} from "./IVenue";

export interface ISponsoredTop {
  id: number;
  venue: IVenue;
  venue_id: number;
  position: number;
  note: string;
  created_at: string;
}
