import {IVenue} from "./IVenue";

export interface ISponsoredTop {
  id: number;
  venue: IVenue;
  position: number;
  note: string;
  created_at: string;
}
