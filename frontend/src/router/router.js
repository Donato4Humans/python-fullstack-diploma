import {createBrowserRouter, Navigate} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {AdminPage} from "../pages/admin/AdminPage";
import {LoginPage} from "../pages/login/LoginPage";
import {VenuesPage} from "../pages/venues/VenuesPage";
import {SearchPage} from "../pages/search/SearchPage";
import {NewsPage} from "../pages/news/NewsPage";



const router = createBrowserRouter([
    {
        path: '', element: <MainLayout/>,
        children: [
            {
                index: true, element: <Navigate to={'login'}/>
            },
            {
                path: 'login', element: <LoginPage/>
            }
        ],
    },
    {
        path: 'venues', element: <VenuesPage/>
    },
    {
        path: 'search', element: <SearchPage/>
    },
    {
        path: 'news', element: <NewsPage/>
    },
    {
        path: 'admin', element: <AdminPage/>,

    }
]);

export {
    router
}