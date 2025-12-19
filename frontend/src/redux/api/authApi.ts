import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import { setUser } from '../slices/userSlice';
import type {IAuthResponse, ISignInRequest} from "../../models/IAuth";


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    signIn: builder.mutation<IAuthResponse, ISignInRequest>({
      query: (credentials) => ({
        url: 'auth',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('access', data.tokens.access);
          localStorage.setItem('refresh', data.tokens.refresh);
          dispatch(setUser(data.user));
        } catch {}
      },
    }),

    activateUser: builder.mutation<void,  string >({
      query: (token) => ({
        url: `auth/activate/${token}`,
        method: 'PATCH'
      }),
    }),

    // Password recovery — request email
    recoveryRequest: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: 'auth/recovery',
        method: 'POST',
        body: data,
      }),
    }),

    // Password recovery — set new password
    recoveryPassword: builder.mutation<void, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `auth/recovery/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),

    getSocketToken: builder.query<{ token: string }, void>({
      query: () => 'auth/socket',
    }),

    getSiteRole: builder.query<any, void>({
      query: () => 'auth/site_role',
    }),
  }),
});

export const {
    useSignInMutation,
    useActivateUserMutation,
    useRecoveryRequestMutation,
    useRecoveryPasswordMutation,
    useGetSocketTokenQuery,
    useGetSiteRoleQuery
} = authApi;