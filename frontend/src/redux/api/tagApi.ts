
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {ITag, IVenueTag} from "../../models/ITag";
import {transformListResponse} from "../../helpers/transform.ts";

export const tagApi = createApi({
  reducerPath: 'tagApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Tag', 'VenueTag', 'Venue'],
  endpoints: (builder) => ({

    // GET /api/tags — list all tags (public)
    getTags: builder.query<ITag[], { search?: string } | undefined>({
      query: (params) => ({
        url: 'tags',
        params,
      }),
        transformResponse: transformListResponse,
      providesTags: (result = []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Tag' as const, id })),
              { type: 'Tag', id: 'LIST' },
            ]
          : [{ type: 'Tag', id: 'LIST' }],
    }),

    // POST /api/tags — create tag (superadmin only)
    createTag: builder.mutation<ITag, { name: string }>({
      query: (data) => ({
        url: 'tags',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),

    // GET /api/tags/<pk> — tag detail
    getTag: builder.query<ITag, number>({
      query: (id) => `tags/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Tag', id }],
    }),

    // PUT /api/tags/<pk> — update tag (superadmin)
    updateTag: builder.mutation<ITag, { id: number; name: string }>({
      query: ({ id, name }) => ({
        url: `tags/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tag', id },
        { type: 'Tag', id: 'LIST' },
      ],
    }),

    // DELETE /api/tags/<pk> — delete tag (superadmin)
    deleteTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `tags/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),

    // GET /api/tags/venue/<venue_pk> — list tags for venue (public)
    getVenueTags: builder.query<IVenueTag[], number>({
      query: (venueId) => `tags/venue/${venueId}`,
        transformResponse: transformListResponse,
      providesTags: (result= [], _error, venueId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'VenueTag' as const, id })),
              { type: 'VenueTag', id: venueId },
            ]
          : [{ type: 'VenueTag', id: venueId }],
    }),

    // POST /api/tags/venue/<venue_pk> — add tag to venue (owner only)
    addTagToVenue: builder.mutation<IVenueTag, { venueId: number; tag_id: number }>({
      query: ({ venueId, tag_id }) => ({
        url: `tags/venue/${venueId}`,
        method: 'POST',
        body: { tag_id },
      }),
      invalidatesTags: (_result, _error, { venueId }) => [
        { type: 'VenueTag', id: venueId },
        { type: 'Venue', id: venueId },  // refetch venue to update tags
      ],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useCreateTagMutation,
  useGetTagQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetVenueTagsQuery,
  useAddTagToVenueMutation,
} = tagApi;