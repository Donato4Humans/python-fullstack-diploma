
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/rtk';
import type {JSX} from "react";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAppSelector((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;