import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {ISearchParams, ISearchResponse} from "../../models/ISearch";
import {transformListResponse} from "../../helpers/transform.ts";

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Search'],
  endpoints: (builder) => ({
    // GET /api/search — global search with all filters
    searchVenues: builder.query<ISearchResponse, ISearchParams | undefined>({
      query: (params) => ({
        url: 'search',
        params,
      }),
        transformResponse: transformListResponse,
      providesTags: ['Search'],
    }),
  }),
});

export const { useSearchVenuesQuery } = searchApi;