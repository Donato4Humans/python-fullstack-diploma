
import {router} from "./router/router";
import {RouterProvider} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./hooks/rtk.ts";
import {useGetCurrentUserQuery} from "./redux/api/userApi.ts";
import {useEffect} from "react";
import {setUser} from "./redux/slices/userSlice.ts";

const RestoreAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: user !== null || !localStorage.getItem('access'),  // Skip if already set or no token
  });

  useEffect(() => {
    if (currentUser && !user) {
      dispatch(setUser(currentUser));  // Sync fetched user to slice
    }
  }, [currentUser, user, dispatch]);

  // Show loading spinner during restore
  if (isLoading && !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
};

const App = () => {
  return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <RestoreAuth>
           <RouterProvider router={router}/>
            </RestoreAuth>
        </div>
  );
}

export default App;
