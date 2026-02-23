
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../redux/slices/userSlice';
import type {BaseQueryFn, FetchArgs, FetchBaseQueryError} from "@reduxjs/toolkit/query";


const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
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
  // Skip refresh logic for login endpoint
  const isLoginRequest = typeof args === 'string'
    ? args.includes('auth/sign-in')
    : args.url.includes('auth/sign-in');

  let result = await baseQuery(args, api, extraOptions);

  // Only handle 401 if it's NOT the login request
  if (result.error && result.error.status === 401 && !isLoginRequest) {
    const refreshToken = localStorage.getItem('refresh');

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: 'auth/refresh',
          method: 'POST',
          body: { refresh: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { access, refresh } = refreshResult.data as { access: string; refresh: string };
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed → real logout
        localStorage.clear();
        api.dispatch(logout());
        // window.location.href = '/auth/sign-in';
      }
    }
    // If no refresh token and it's not login request → just return error (no redirect)
  }

  return result;
};