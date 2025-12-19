import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { userApi } from "./api/userApi";
import { venueApi } from './api/venueApi';
import { venueOwnerApi } from "./api/venueOwnerApi";
import { reviewApi } from './api/reviewApi';
import { commentApi } from './api/commentApi';
import { newsApi } from './api/newsApi';
import { tagApi } from './api/tagApi';
import { topApi } from './api/topApi';
import { favoritesApi } from './api/favoritesApi';
import { piyachokApi } from './api/piyachokApi';
import { chatApi } from "./api/chatApi";
import { forbiddenWordsApi } from "./api/forbiddenWordsApi";
import { searchApi } from "./api/searchApi";
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [venueApi.reducerPath]: venueApi.reducer,
    [venueOwnerApi.reducerPath]: venueOwnerApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
    [topApi.reducerPath]: topApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [piyachokApi.reducerPath]: piyachokApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [forbiddenWordsApi.reducerPath]: forbiddenWordsApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      venueApi.middleware,
      venueOwnerApi.middleware,
      reviewApi.middleware,
      commentApi.middleware,
      newsApi.middleware,
      tagApi.middleware,
      topApi.middleware,
      favoritesApi.middleware,
      piyachokApi.middleware,
      chatApi.middleware,
      forbiddenWordsApi.middleware,
      searchApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;