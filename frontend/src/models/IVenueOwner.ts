import {IVenue} from "./IVenue";
import {IUser} from "./IUser";

export interface IVenueOwner {
  id: number;
  user: IUser;
  venues: IVenue[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}