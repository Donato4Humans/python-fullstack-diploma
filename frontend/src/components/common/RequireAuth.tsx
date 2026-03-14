
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/rtk';
import type {JSX} from "react";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthRestored } = useAppSelector((state) => state.user);
  const location = useLocation();

  // Wait until restoration is finished
  if (!isAuthRestored) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Перевірка авторизації...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;