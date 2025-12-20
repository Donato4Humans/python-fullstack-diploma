
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {IFavorite} from "../../models/IFavorite";
import {transformListResponse} from "../../helpers/transform.ts";

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Favorite'],
  endpoints: (builder) => ({

    // GET /api/favorite — list user's favorites
    getFavorites: builder.query<IFavorite[], void>({
      query: () => 'favorite',
        transformResponse: transformListResponse,
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Favorite' as const, id })),
              { type: 'Favorite', id: 'LIST' },
            ]
          : [{ type: 'Favorite', id: 'LIST' }],
    }),

    // POST /api/favorite — add venue to favorites
    addFavorite: builder.mutation<IFavorite, { venue_id: number }>({
      query: (data) => ({
        url: 'favorite',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Favorite', id: 'LIST' }],
    }),

    // DELETE /api/favorite/<pk> — remove from favorites
    removeFavorite: builder.mutation<{ detail: string }, number>({
      query: (id) => ({
        url: `favorite/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Favorite', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;