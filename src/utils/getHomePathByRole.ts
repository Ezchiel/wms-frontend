import type { UserRole } from '../features/auth/authTypes';

export const getHomePathByRole = (role?: UserRole): string => {
  if (role === 'ADMIN' || role === 'MANAGER') {
    return '/dashboard';
  }
  return '/mobile';
};
