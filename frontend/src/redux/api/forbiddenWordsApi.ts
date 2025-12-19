
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {IForbiddenWord} from "../../models/IForbiddenWord";


export const forbiddenWordsApi = createApi({
  reducerPath: 'forbiddenWordsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ForbiddenWord'],

  endpoints: (builder) => ({
    // GET /api/forbidden_words — list all forbidden words (admin only)
    getForbiddenWords: builder.query<IForbiddenWord[], void>({
      query: () => 'forbidden_words',
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ForbiddenWord' as const, id })),
              { type: 'ForbiddenWord', id: 'LIST' },
            ]
          : [{ type: 'ForbiddenWord', id: 'LIST' }],
    }),

    // POST /api/forbidden_words — create new word (admin only)
    createForbiddenWord: builder.mutation<IForbiddenWord, { word: string }>({
      query: (data) => ({
        url: 'forbidden_words',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'ForbiddenWord', id: 'LIST' }],
    }),

    // GET /api/forbidden_words/<pk> — detail
    getForbiddenWord: builder.query<IForbiddenWord, number>({
      query: (id) => `forbidden_words/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ForbiddenWord', id }],
    }),

    // PUT /api/forbidden_words/<pk> — full update
    updateForbiddenWord: builder.mutation<IForbiddenWord, { id: number; word: string }>({
      query: ({ id, word }) => ({
        url: `forbidden_words/${id}`,
        method: 'PUT',
        body: { word },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ForbiddenWord', id },
        { type: 'ForbiddenWord', id: 'LIST' },
      ],
    }),

    // PATCH /api/forbidden_words/<pk> — partial update
    partialUpdateForbiddenWord: builder.mutation<IForbiddenWord, { id: number; word: string }>({
      query: ({ id, word }) => ({
        url: `forbidden_words/${id}`,
        method: 'PATCH',
        body: { word },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ForbiddenWord', id },
        { type: 'ForbiddenWord', id: 'LIST' },
      ],
    }),

    // DELETE /api/forbidden_words/<pk> — delete word
    deleteForbiddenWord: builder.mutation<void, number>({
      query: (id) => ({
        url: `forbidden_words/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ForbiddenWord', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetForbiddenWordsQuery,
  useCreateForbiddenWordMutation,
  useGetForbiddenWordQuery,
  useUpdateForbiddenWordMutation,
  usePartialUpdateForbiddenWordMutation,
  useDeleteForbiddenWordMutation,
} = forbiddenWordsApi;