import {IVenue} from "./IVenue";

export interface ISearchResponse {
  count: number;
  results: IVenue[];
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