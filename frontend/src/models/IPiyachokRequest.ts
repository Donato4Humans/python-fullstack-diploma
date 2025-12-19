import {IUser} from "./IUser";
import {IVenue} from "./IVenue";

export interface IPiyachokRequest {
  id: number;
  requester: IUser;
  requester_id: number;
  gender_preference: 'M' | 'F' | 'A';
  budget: number;
  who_pays: 'me' | 'them' | 'split';
  preferred_venue: IVenue | null;
  preferred_venue_id?: number | null;
  venue_title: string | null;
  status: 'pending' | 'matched' | 'rejected' | 'expired';
  note: string;
  created_at: string;
  updated_at: string;
}