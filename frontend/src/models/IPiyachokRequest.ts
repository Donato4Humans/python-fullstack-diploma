import type {IUser} from "./IUser";
import type {IVenue} from "./IVenue";

export interface IPiyachokRequest {
  id: number;
  requester: IUser;
  requester_name: string | null;
  requester_id?: number;
  gender_preference: 'M' | 'F' | 'A';
  budget: number;
  who_pays: 'me' | 'them' | 'split';
  preferred_venue?: IVenue | null;
  preferred_venue_id?: number | null; // request only
  venue_title: string | null;
  status: 'pending' | 'matched' | 'rejected' | 'expired';
  note: string;
  created_at: string;
  updated_at: string;
}