import type {IVenueTag} from "./ITag";

export interface IVenue {
  id: number;
  title: string;
  description?: string;
  schedule: string;
  average_check: number;
  rating: number;
  latitude: number | null;
  longitude: number | null;
  house: number;
  street: string;
  city: string;
  region?: string;
  country?: string;
  category: 'cafe' | 'restaurant' | 'bar' | 'mixed';
  owner: number;
  owner_id?: number;
  photo: string | null;
  venue_tags?: IVenueTag[];
  views: number;
  daily_views: number;
  weekly_views: number;
  monthly_views: number;
  last_view_date: string | null;
  is_active: boolean;
  is_moderated: boolean;
  bad_word_attempts: number;
  favorite_count: number;
  piyachok_request_count: number;
  created_at: string;
  updated_at: string;
}