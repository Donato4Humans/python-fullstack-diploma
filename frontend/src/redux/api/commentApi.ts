
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {IComment} from "../../models/IComment";
import {transformListResponse} from "../../helpers/transform.ts";

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Comment', 'VenueComments', 'BlockedComments'],
  endpoints: (builder) => ({

    // GET /api/comments/venue/<venue_pk> — visible comments (public)
    getVenueComments: builder.query<IComment[], number>({
      query: (venueId) => `comments/venue/${venueId}`,
        transformResponse: transformListResponse,
      providesTags: (result= [], _error, venueId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Comment' as const, id })),
              { type: 'VenueComments', id: venueId },
            ]
          : [{ type: 'VenueComments', id: venueId }],
    }),

    // POST /api/comments/venue/<venue_pk> — create comment (auth)
    createComment: builder.mutation<IComment, { venueId: number; text: string }>({
      query: ({ venueId, text }) => ({
        url: `comments/venue/${venueId}`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (_result, _error, { venueId }) => [
        { type: 'VenueComments', id: venueId },
        'Comment',  // my comments
      ],
    }),

    // GET /api/comments/my — my visible comments (auth)
    getMyComments: builder.query<IComment[], void>({
      query: () => 'comments/my',
        transformResponse: transformListResponse,
      providesTags: (result= []) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Comment' as const, id })), 'Comment']
          : ['Comment'],
    }),

    // GET /api/comments/<pk> — comment detail
    getComment: builder.query<IComment, number>({
      query: (id) => `comments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Comment', id }],
    }),

    // PUT /api/comments/<pk> — update comment (owner/admin)
    updateComment: builder.mutation<IComment, { id: number; text: string }>({
      query: ({ id, text }) => ({
        url: `comments/${id}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: () => [
        'Comment',        // refetch my comments
        'VenueComments',  // refetch all venue comments lists
      ],
    }),

    // DELETE /api/comments/<pk> — delete comment (owner/admin)
    deleteComment: builder.mutation<void, number>({
      query: (id) => ({
        url: `comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        'Comment',
        'VenueComments',
      ],
    }),

    // GET /api/comments/blocked — blocked comments (admin only)
    getBlockedComments: builder.query<IComment[], void>({
      query: () => 'comments/blocked',
        transformResponse: transformListResponse,
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'BlockedComments' as const, id })),
              { type: 'BlockedComments', id: 'LIST' },
            ]
          : [{ type: 'BlockedComments', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetVenueCommentsQuery,
  useCreateCommentMutation,
  useGetMyCommentsQuery,
  useGetCommentQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetBlockedCommentsQuery,
} = commentApi;