
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {IPiyachokRequest} from "../../models/IPiyachokRequest";
import type {IMatch} from "../../models/IMatch";

export const piyachokApi = createApi({
  reducerPath: 'piyachokApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['PiyachokRequest', 'MyRequests', 'ActiveRequests', 'VenueRequests', 'Match'],

  endpoints: (builder) => ({

    // GET /api/piyachok/requests — my requests list
    getMyRequests: builder.query<IPiyachokRequest[], void>({
      query: () => 'piyachok/requests',
      providesTags: ['MyRequests'],
    }),

    // POST /api/piyachok/requests — create request
    createRequest: builder.mutation<IPiyachokRequest, Partial<IPiyachokRequest>>({
      query: (data) => ({
        url: 'piyachok/requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyRequests', 'ActiveRequests'],
    }),

    // GET /api/piyachok/requests/<pk> — my request detail
    getMyRequest: builder.query<IPiyachokRequest, number>({
      query: (id) => `piyachok/requests/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'MyRequests', id }],
    }),

    // PUT /api/piyachok/requests/<pk> — update request (if pending)
    updateRequest: builder.mutation<IPiyachokRequest, { id: number; data: Partial<IPiyachokRequest> }>({
      query: ({ id, data }) => ({
        url: `piyachok/requests/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'MyRequests', id },
        'MyRequests',
        'ActiveRequests',
      ],
    }),

    // GET /api/piyachok/matches — my matches
    getMyMatches: builder.query<IMatch[], void>({
      query: () => 'piyachok/matches',
      providesTags: ['Match'],
    }),

    // PATCH /api/piyachok/matches/<pk>/accept — accept match + create chat room
    acceptMatch: builder.mutation<{ detail: string; chat_room: string }, number>({
      query: (id) => ({
        url: `piyachok/matches/${id}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Match', 'MyRequests'],
    }),

    // GET /api/piyachok/active — all active requests (authenticated)
    getActiveRequests: builder.query<IPiyachokRequest[], void>({
      query: () => 'piyachok/active',
      providesTags: ['ActiveRequests'],
    }),

    // GET /api/piyachok/venue/<venue_pk> — active requests for specific venue
    getVenueRequests: builder.query<IPiyachokRequest[], number>({
      query: (venueId) => `piyachok/venue/${venueId}`,
      providesTags: (_result, _error, venueId) => [{ type: 'VenueRequests', id: venueId }],
    }),

    // POST /api/piyachok/join/<pk> — join request (instant match + chat)
    joinRequest: builder.mutation<
      { detail: string; chat_room: string; match_id: number },
      number
    >({
      query: (requestId) => ({
        url: `piyachok/join/${requestId}`,
        method: 'POST',
      }),
      invalidatesTags: ['ActiveRequests', 'MyRequests', 'Match'],
    }),

    // POST /api/piyachok/run-matching — manual matching (admin only)
    runMatching: builder.mutation<{ detail: string }, void>({
      query: () => ({
        url: 'piyachok/run-matching',
        method: 'POST',
      }),
      invalidatesTags: ['ActiveRequests', 'MyRequests', 'Match'],
    }),
  }),
});

export const {
  useGetMyRequestsQuery,
  useCreateRequestMutation,
  useGetMyRequestQuery,
  useUpdateRequestMutation,
  useGetMyMatchesQuery,
  useAcceptMatchMutation,
  useGetActiveRequestsQuery,
  useGetVenueRequestsQuery,
  useJoinRequestMutation,
  useRunMatchingMutation,
} = piyachokApi;