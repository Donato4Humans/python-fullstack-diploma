
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {INews} from "../../models/INews";
import type {TagDescription} from "@reduxjs/toolkit/query";

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['News', 'GlobalNews', 'VenueNews'],
  endpoints: (builder) => ({

    // GET /api/news — all news (global + venue) (public)
    getAllNews: builder.query<INews[], void>({
      query: () => 'news',
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'News' as const, id })),
              'News',
              'GlobalNews',
            ]
          : ['News', 'GlobalNews'],
    }),

    // POST /api/news — create news (auth)
    createNews: builder.mutation<INews, Partial<INews>>({
      query: (data) => ({
        url: 'news',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['News', 'GlobalNews'],
    }),

    // GET /api/news/global — global news only (public)
    getGlobalNews: builder.query<INews[], void>({
      query: () => 'news/global',
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'News' as const, id })),
              'GlobalNews',
            ]
          : ['GlobalNews'],
    }),

    // GET /api/news/venue/<venue_pk> — venue news only (public)
    getVenueNews: builder.query<INews[], number>({
      query: (venueId) => `news/venue/${venueId}`,
      providesTags: (result= [], _error, venueId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'News' as const, id })),
              { type: 'VenueNews', id: venueId },
            ]
          : [{ type: 'VenueNews', id: venueId }],
    }),

    // GET /api/news/<pk> — news detail
    getNews: builder.query<INews, number>({
      query: (id) => `news/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'News', id }],
    }),

    // PUT /api/news/<pk> — update news (author/admin)
    updateNews: builder.mutation<INews, { id: number; data: Partial<INews> }>({
      query: ({ id, data }) => ({
        url: `news/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, _error, { id }) => {
        const venueId = result?.venue?.id;

        const tags: TagDescription<'News' | 'GlobalNews' | 'VenueNews'>[] = [
          { type: 'News', id },
          { type: 'News', id: 'LIST' },
          { type: 'GlobalNews', id: 'LIST' },
        ];

        if (venueId) {
          tags.push({ type: 'VenueNews', id: venueId });
        }

        return tags;
      },
    }),

    // DELETE /api/news/<pk> — delete news (author/admin)
    deleteNews: builder.mutation<void, number>({
      query: (id) => ({
        url: `news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [
        { type: 'News', id: 'LIST' },
        { type: 'GlobalNews', id: 'LIST' },

      ],
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useCreateNewsMutation,
  useGetGlobalNewsQuery,
  useGetVenueNewsQuery,
  useGetNewsQuery,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;