
import {router} from "./router/router";
import {RouterProvider} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "./hooks/rtk.ts";
import {useGetCurrentUserQuery} from "./redux/api/userApi.ts";
import {useEffect} from "react";
import {setUser, setAuthRestored} from "./redux/slices/userSlice.ts";

const RestoreAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthRestored } = useAppSelector((state) => state.user);

  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: user !== null || !localStorage.getItem('access'),  // Skip if already set or no token
  });

  useEffect(() => {
    if (currentUser && !user) {
      dispatch(setUser(currentUser));
    } else if (!isLoading && !currentUser) {
      dispatch(setAuthRestored());   // Mark as restored even if no user
    }
  }, [currentUser, user, isLoading, dispatch]);

  if (!isAuthRestored) { // loading... while restoring auth
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Перевірка авторизації...</p>
        </div>
      </div>
    );
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
