
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type { ISignUpRequest, ISignUpResponse} from '../../models/IAuth';
import { setUser } from '../slices/userSlice';
import type {IBlockUnblockRequest, IBlockUnblockResponse, IMakeCriticResponse, IUser} from "../../models/IUser";
import {transformListResponse} from "../../helpers/transform.ts";

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth, tagTypes: ['User'],
  endpoints: (builder) => ({

    signUp: builder.mutation<ISignUpResponse, ISignUpRequest>({
      query: (data) => ({
        url: 'user/registration',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(setUser(data));
        } catch (error) {
          console.error('Registration failed:', error);
        }
      },
    }),

    getCurrentUser: builder.query<IUser, void>({
      query: () => 'user/me',

      providesTags: ['User'],
    }),

    getUsers: builder.query<IUser[], void>({
      query: () => 'user',
        transformResponse: transformListResponse,
      providesTags: ['User'],
    }),

    // Get user detail
    getUser: builder.query<IUser, number>({
      query: (id) => `user/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Update user
    updateUser: builder.mutation<IUser, { id: number; data: Partial<IUser> }>({
      query: ({ id, data }) => ({
        url: `user/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, 'User'],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Block/Unblock user
    blockUnblockUser: builder.mutation<IBlockUnblockResponse, { id: number; data: IBlockUnblockRequest }>({
      query: ({ id, data }) => ({
        url: `user/block_unblock/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }, 'User'],
    }),

    // Make user critic
    makeCritic: builder.mutation<IMakeCriticResponse, number>({
      query: (id) => ({
        url: `user/make_critic/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'User', id }, 'User'],
    }),
  }),
});

export const {
      useGetUsersQuery,
      useSignUpMutation,
      useGetCurrentUserQuery,
      useGetUserQuery,
      useUpdateUserMutation,
      useDeleteUserMutation,
      useBlockUnblockUserMutation,
      useMakeCriticMutation,
} = userApi;