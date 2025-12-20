
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {IReview} from "../../models/IReview";
import {transformListResponse} from "../../helpers/transform.ts";


export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Review', 'VenueReviews', 'Venue'],
  endpoints: (builder) => ({

    // GET /api/review/venue/<venue_pk> — list reviews for venue (public)
    getVenueReviews: builder.query<IReview[], number>({
      query: (venueId) => `review/venue/${venueId}`,
        transformResponse: transformListResponse,
      providesTags: (result= [], _error, venueId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Review' as const, id })),
              { type: 'VenueReviews', id: venueId },
            ]
          : [{ type: 'VenueReviews', id: venueId }],
    }),

    createReview: builder.mutation<IReview, { venueId: number; data: { rating: number; text?: string } }>({
      query: ({ venueId, data }) => ({
        url: `review/venue/${venueId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { venueId }) => [
        { type: 'VenueReviews', id: venueId },
        { type: 'Venue', id: venueId },  // refetch venue to update rating
        'Review',                        // refetch my reviews if needed
      ],
    }),

    // GET /api/review/my — my reviews (auth)
    getMyReviews: builder.query<IReview[], void>({
      query: () => 'review/my',
        transformResponse: transformListResponse,
      providesTags: (result= []) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Review' as const, id })), 'Review']
          : ['Review'],
    }),

    // GET /api/review/<pk> — review detail
    getReview: builder.query<IReview, number>({
      query: (id) => `review/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Review', id }],
    }),

    // PUT /api/review/<pk> — update review (owner/admin)
    updateReview: builder.mutation<IReview, { id: number; data: { rating?: number; text?: string } }>({
      query: ({ id, data }) => ({
        url: `review/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, _error, arg) => {
        // result is IReview — has venue (number) from serializer
        const venueId = result?.venue as number | undefined;
        return [
          { type: 'Review', id: arg.id },
          { type: 'VenueReviews', id: venueId || 'LIST' },
          { type: 'Venue', id: venueId || 'LIST' },
          'Review',
        ];
      },
    }),

    // DELETE /api/review/<pk> — delete review (owner/admin)
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `review/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        'Review',  // refetch my reviews
        'VenueReviews',  // refetch all venue review lists
        'Venue',  // refetch venues to update rating
      ],
    }),
  }),
});

export const {
  useGetVenueReviewsQuery,
  useCreateReviewMutation,
  useGetMyReviewsQuery,
  useGetReviewQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;