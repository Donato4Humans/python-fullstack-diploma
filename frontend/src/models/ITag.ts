import type {IVenue} from "./IVenue";

export interface ITag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IVenueTag {
  id: number;
  venue: IVenue;
  venue_id: number;
  tag: ITag;
  tag_id: number;
  created_at: string;
  updated_at: string;
}