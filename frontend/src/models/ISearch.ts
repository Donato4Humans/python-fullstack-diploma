import type {IVenue} from "./IVenue";

export interface ISearchResponse {
  total_items: number;
  total_pages: number;
  prev: boolean;
  next: boolean;
  data: IVenue[];
}

export interface ISearchParams {
  q?: string;
  category?: 'cafe' | 'restaurant' | 'bar' | 'mixed';
  min_rating?: number;
  max_rating?: number;
  min_price?: number;
  max_price?: number;
  tag?: string[];
  order_by?: 'rating' | 'average_check' | '-average_check' | 'newest' | 'views';
}