import type {IPiyachokRequest} from "./IPiyachokRequest";
import type {IVenue} from "./IVenue";

export interface IMatch {
  id: number;
  request1: IPiyachokRequest;
  request2: IPiyachokRequest | null;
  suggested_venue: IVenue | null;
  suggested_venue_id: number;
  request1_id: number;
  request2_id: number | null;
  chat_room_id: string;
  is_accepted: boolean;
  note: string;
  created_at: string;
}