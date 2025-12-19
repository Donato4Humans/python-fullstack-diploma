
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../redux/slices/userSlice';
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query";


const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:80/api/',
  prepareHeaders: (headers, { }) => {
    const token = localStorage.getItem('access');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try refresh
    const refreshResult = await baseQuery(
      {
        url: 'auth/refresh',
        method: 'POST',
        body: { refresh: localStorage.getItem('refresh') },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { access, refresh } = refreshResult.data as { access: string; refresh: string };
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Logout
      localStorage.clear();
      api.dispatch(logout());
      window.location.href = '/auth/sign-in';
    }
  }

  return result;
};