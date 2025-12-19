
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../helpers/api';
import type {IChatRoom, IChatRoomDetailResponse} from "../../models/IChat";



export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['ChatRoom', 'Message'],

  endpoints: (builder) => ({

    // GET /api/chat — list user's chat rooms
    getChatRooms: builder.query<IChatRoom[], void>({
      query: () => 'chat',
      providesTags: (result= []) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ChatRoom' as const, id })),
              { type: 'ChatRoom', id: 'LIST' },
            ]
          : [{ type: 'ChatRoom', id: 'LIST' }],
    }),

    // GET /api/chat/<pk> — chat room detail + messages
    getChatRoomDetail: builder.query<IChatRoomDetailResponse, number>({
      query: (roomId) => `chat/${roomId}`,
      providesTags: (_result, _error, roomId) => [
        { type: 'ChatRoom', id: roomId },
        { type: 'Message', id: 'LIST' },
      ],
    }),

    // DELETE /api/chat/delete/<pk> — delete chat room
    deleteChatRoom: builder.mutation<void, number>({
      query: (roomId) => ({
        url: `chat/delete/${roomId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, roomId) => [
        { type: 'ChatRoom', id: roomId },
        { type: 'ChatRoom', id: 'LIST' },
      ],
    }),

    // DELETE /api/chat/messages/delete/<pk> — delete message
    deleteMessage: builder.mutation<void, number>({
      query: (messageId) => ({
        url: `chat/messages/delete/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, messageId) => [
        { type: 'Message', id: messageId },
        { type: 'Message', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetChatRoomsQuery,
  useGetChatRoomDetailQuery,
  useDeleteChatRoomMutation,
  useDeleteMessageMutation,
} = chatApi;