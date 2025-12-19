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
import AdminPage from '../pages/Profile/AdminPage';
import CreateVenuePage from '../pages/Profile/CreateVenuePage';
import EditVenuePage from '../pages/Profile/EditVenuePage';
import FavoritesPage from '../pages/Profile/FavoritesPage';
import MyVenuesPage from '../pages/Profile/MyVenuesPage';
import MyCommentsPage from '../pages/Profile/MyCommentsPage';
import MyReviewsPage from '../pages/Profile/MyReviewsPage';
import MyMatchesPage from '../pages/profile/MyMatchesPage';
import ProfileMainPage from '../pages/profile/ProfileMainPage';
import ProfileSecurityPage from '../pages/Profile/ProfileSecurityPage';
import NewsGeneralPage from "../pages/news/NewsGeneralPage";
import NewsDetailPage from "../pages/news/NewsDetailPage";
import NewsVenuePage from "../pages/news/NewsVenuePage";
import NewsVenueDetailPage from "../pages/news/NewsVenueDetailPage";
import TopPage from "../pages/top/TopPage";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'venues', element: <VenuesPage /> },
            { path: 'venues/:venueId', element: <VenuePage /> },
            { path: 'piyachok', element: <PiyachokPage /> },
            { path: 'piyachok/venue/:venueId', element: <VenuePiyachokPage /> },
            { path: 'news-general', element: <NewsGeneralPage /> },
            { path: 'news-general/:newsId', element: <NewsDetailPage /> },
            { path: 'news-venues/:venueId', element: <NewsVenuePage /> },
            { path: 'news-venues/venue/:newsId', element: <NewsVenueDetailPage /> },
            { path: 'top', element: <TopPage /> },
            {
                path: 'profile',
                element: <ProfileLayout />,
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
        path: '/auth/activate',
        element: <VerifyEmailPage />,
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

const router = createBrowserRouter(routes);
export default router;