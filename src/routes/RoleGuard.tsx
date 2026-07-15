import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { UserRole } from '../features/auth/authTypes';
import { getHomePathByRole } from '../utils/getHomePathByRole';

interface RoleGuardProps {
  allow: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allow }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allow.includes(user.role)) {
    // If the role is not allowed, redirect to their home path
    return <Navigate to={getHomePathByRole(user?.role)} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
