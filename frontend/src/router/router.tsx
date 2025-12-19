import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProfileLayout from '../layouts/ProfileLayout';
import NotFoundPage from '../pages/404/NotFoundPage';
import SignInPage from '../pages/auth/SignInPage';
import SignUpPage from '../pages/auth/SignUpPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import HomePage from '../pages/home/HomePage';
import VenuesPage from '../pages/venues/VenuesPage';
import VenuePage from '../pages/venues/VenuePage';
import PiyachokPage from '../pages/piyachok/PiyachokPage';
import VenuePiyachokPage from '../pages/piyachok/VenuePiyachokPage';
import NewsGeneralPage from "../pages/news/NewsGeneralPage";
import NewsDetailPage from "../pages/news/NewsDetailPage";
import NewsVenuePage from "../pages/news/NewsVenuePage";
import NewsVenueDetailPage from "../pages/news/NewsVenueDetailPage";
import TopPage from "../pages/top/TopPage";
import ProfileMainPage from '../pages/profile/ProfileMainPage';
import MyMatchesPage from '../pages/profile/MyMatchesPage';
import MyVenuesPage from '../pages/profile/MyVenuesPage';
import CreateVenuePage from '../pages/profile/CreateVenuePage';
import EditVenuePage from '../pages/profile/EditVenuePage';
import FavoritesPage from '../pages/profile/FavoritesPage';
import MyCommentsPage from '../pages/profile/MyCommentsPage';
import MyReviewsPage from '../pages/profile/MyReviewsPage';
import ProfileSecurityPage from '../pages/profile/ProfileSecurityPage';
import AdminPage from '../pages/profile/AdminPage';
import RequireAuth from "../components/common/RequireAuth";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'venues', element: <VenuesPage /> },
            { path: 'venues/:venueId', element: <VenuePage /> },
            { path: 'piyachok', element: <RequireAuth><PiyachokPage /></RequireAuth> },
            { path: 'piyachok/venue/:venueId', element: <RequireAuth><VenuePiyachokPage /></RequireAuth> },
            { path: 'news-general', element: <NewsGeneralPage /> },
            { path: 'news-general/:newsId', element: <NewsDetailPage /> },
            { path: 'news-venues/:venueId', element: <NewsVenuePage /> },
            { path: 'news-venues/venue/:newsId', element: <NewsVenueDetailPage /> },
            { path: 'top', element: <TopPage /> },
            {
                path: 'profile',
                element: <RequireAuth><ProfileLayout /></RequireAuth>,
                children: [
                    { index: true, element: <ProfileMainPage /> },
                    { path: 'my-venues', element: <MyVenuesPage /> },
                    { path: 'create-venue', element: <CreateVenuePage /> },
                    { path: 'edit-venue/:venueId', element: <EditVenuePage /> },
                    { path: 'favorites', element: <FavoritesPage /> },
                    { path: 'comments', element: <MyCommentsPage /> },
                    { path: 'reviews', element: <MyReviewsPage /> },
                    { path: 'matches', element: <MyMatchesPage /> },
                    { path: 'security', element: <ProfileSecurityPage /> },
                    { path: 'admin', element: <AdminPage /> },
                ],
            },
            {
                path: 'auth',
                children: [
                    { path: 'sign-in', element: <SignInPage /> },
                    { path: 'sign-up', element: <SignUpPage /> },
                ],
            },
        ],
    },
    {
        path: '/auth/activate/:token',
        element: <VerifyEmailPage />,
    },
    {
      path: '/auth/recovery/:token',
      element: <ProfileSecurityPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

export const router = createBrowserRouter(routes);
export default router;