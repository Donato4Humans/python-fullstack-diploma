
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import {IVenue} from "../../models/IVenue";
import {ISponsoredTop} from "../../models/ISponsoredTop";


export const topApi = createApi({
  reducerPath: 'topApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Top', 'SponsoredTop'],

  endpoints: (builder) => ({

    // GET /api/top — dynamic top (with filters: order_by, category, tag, min_rating)
    getTopVenues: builder.query<IVenue[], {
      category?: string;
      tag?: string[];
      min_rating?: number;
      max_rating?: number;
      order_by?: 'rating' | 'views' | 'daily_views' | 'newest';
    } | undefined>({
      query: (params) => ({
        url: 'top',
        params,
      }),
      providesTags: ['Top'],
    }),

    // GET /api/top/category/<category> — top 10 by category
    getTopByCategory: builder.query<IVenue[], string>({
      query: (category) => `top/category/${category}`,
      providesTags: ['Top'],
    }),

    // GET /api/top/tag/<tag_name> — top 10 by tag
    getTopByTag: builder.query<IVenue[], string>({
      query: (tag_name) => `top/tag/${tag_name}`,
      providesTags: ['Top'],
    }),

    // GET /api/top/sponsored — public sponsored top
    getSponsoredTop: builder.query<ISponsoredTop[], void>({
      query: () => 'top/sponsored',
      providesTags: ['SponsoredTop'],
    }),

    // GET /api/top/sponsored/admin — admin list
    getAdminSponsoredTop: builder.query<ISponsoredTop[], void>({
      query: () => 'top/sponsored/admin',
      providesTags: ['SponsoredTop'],
    }),

    // POST /api/top/sponsored/admin — admin create/update
    createSponsoredTop: builder.mutation<ISponsoredTop, Partial<ISponsoredTop>>({
      query: (data) => ({
        url: 'top/sponsored/admin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SponsoredTop'],
    }),
  }),
});

export const {
  useGetTopVenuesQuery,
  useGetTopByCategoryQuery,
  useGetTopByTagQuery,
  useGetSponsoredTopQuery,
  useGetAdminSponsoredTopQuery,
  useCreateSponsoredTopMutation,
} = topApi;