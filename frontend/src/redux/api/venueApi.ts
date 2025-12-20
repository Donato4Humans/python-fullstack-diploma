
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {IVenue} from "../../models/IVenue";
import {transformListResponse} from "../../helpers/transform.ts";


export const venueApi = createApi({
  reducerPath: 'venueApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Venue', 'InactiveVenue'],
  endpoints: (builder) => ({
    // GET /api/venues — list active venues (public)
    getVenues: builder.query<IVenue[], { category?: string; q?: string } | undefined>({
      query: (params) => ({
        url: 'venues',
        params,
      }),
      transformResponse: transformListResponse,
      providesTags: (result=[], error) => {
        if (error || !result) {
          return [{ type: 'Venue', id: 'LIST' }];
        }
        const items = Array.isArray(result) ? result : [];
        return [
          ...items.map(({ id }) => ({ type: 'Venue' as const, id })),
          { type: 'Venue', id: 'LIST' },
        ];
      },
    }),

    getMyVenues: builder.query<IVenue[], void>({
      query: () => 'venues/my',
        transformResponse: transformListResponse,
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Venue' as const, id })),
              { type: 'Venue' as const, id: 'MY_LIST' },
            ]
          : [{ type: 'Venue' as const, id: 'MY_LIST' }],
    }),

    // GET /api/venues/<pk> — venue detail (public)
    getVenue: builder.query<IVenue, number>({
      query: (id) => `venues/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Venue', id }],
    }),

    // POST /api/venues — create venue (authenticated)
    createVenue: builder.mutation<IVenue, Partial<IVenue>>({
      query: (data) => ({
        url: 'venues',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Venue', id: 'LIST' }],
    }),

    // PUT /api/venues/<pk> — update venue (owner/admin)
    updateVenue: builder.mutation<IVenue, { id: number; data: Partial<IVenue> }>({
      query: ({ id, data }) => ({
        url: `venues/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Venue', id },
        { type: 'Venue', id: 'LIST' },
      ],
    }),

    // DELETE /api/venues/<pk> — delete venue (owner/admin)
    deleteVenue: builder.mutation<void, number>({
      query: (id) => ({
        url: `venues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Venue', id: 'LIST' }],
    }),

    // PATCH /api/venues/<pk>/transfer — transfer ownership (superadmin)
    transferVenueOwnership: builder.mutation<
      { detail: string; venue_id: number; new_owner: string },
      { id: number; new_owner_id: number }
    >({
      query: ({ id, new_owner_id }) => ({
        url: `venues/${id}/transfer`,
        method: 'PATCH',
        body: { new_owner_id },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Venue', id },
        { type: 'Venue', id: 'LIST' },
      ],
    }),

    // PUT /api/venues/photo/<pk> — update photo (owner/admin)
    updateVenuePhoto: builder.mutation<IVenue, { id: number; photo: File }>({
      query: ({ id, photo }) => {
        const formData = new FormData();
        formData.append('photo', photo);
        return {
          url: `venues/photo/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Venue', id }],
    }),

    // GET /api/venues/inactive — list inactive venues (admin only)
    getInactiveVenues: builder.query<IVenue[], void>({
      query: () => 'venues/inactive',
        transformResponse: transformListResponse,
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'InactiveVenue' as const, id })),
              { type: 'InactiveVenue', id: 'LIST' },
            ]
          : [{ type: 'InactiveVenue', id: 'LIST' }],
    }),

    // DELETE /api/venues/inactive/delete/<pk> — delete inactive venue (admin only)
    deleteInactiveVenue: builder.mutation<void, number>({
      query: (id) => ({
        url: `venues/inactive/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'InactiveVenue', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetVenuesQuery,
  useGetVenueQuery,
  useGetMyVenuesQuery,
  useCreateVenueMutation,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
  useTransferVenueOwnershipMutation,
  useUpdateVenuePhotoMutation,
  useGetInactiveVenuesQuery,
  useDeleteInactiveVenueMutation,
} = venueApi;