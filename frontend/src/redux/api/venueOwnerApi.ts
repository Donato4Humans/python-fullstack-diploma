
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {IVenueOwner} from "../../models/IVenueOwner";
import {transformListResponse} from "../../helpers/transform.ts";


export const venueOwnerApi = createApi({
  reducerPath: 'venueOwnerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['VenueOwner'],
  endpoints: (builder) => ({

    // GET /api/venue_owners — list owners (admin only)
    getVenueOwners: builder.query<IVenueOwner[], void>({
      query: () => 'venue_owners',
        transformResponse: transformListResponse,
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'VenueOwner' as const, id })),
              { type: 'VenueOwner', id: 'LIST' },
            ]
          : [{ type: 'VenueOwner', id: 'LIST' }],
    }),

    // POST /api/venue_owners — create owner (authenticated or superadmin)
    createVenueOwner: builder.mutation<IVenueOwner, { user_id?: number }>({
      query: (data) => ({
        url: 'venue_owners',
        method: 'POST',
        body: data,  // superadmin can send user_id, regular user — empty
      }),
      invalidatesTags: [{ type: 'VenueOwner', id: 'LIST' }],
    }),

    // GET /api/venue_owners/<pk> — owner detail (owner/admin)
    getVenueOwner: builder.query<IVenueOwner, number>({
      query: (id) => `venue_owners/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'VenueOwner', id }],
    }),

    // DELETE /api/venue_owners/<pk> — delete owner (owner/admin)
    deleteVenueOwner: builder.mutation<void, number>({
      query: (id) => ({
        url: `venue_owners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'VenueOwner', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetVenueOwnersQuery,
  useCreateVenueOwnerMutation,
  useGetVenueOwnerQuery,
  useDeleteVenueOwnerMutation,
} = venueOwnerApi;