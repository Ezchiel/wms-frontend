import type React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { getHomePathByRole } from '../utils/getHomePathByRole';

const PublicRoute: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);

  if (token) {
    return <Navigate to={getHomePathByRole(user?.role)} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
