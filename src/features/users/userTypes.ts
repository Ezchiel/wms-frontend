import type { Meta } from '../../types/api.types';

export interface User {
  id: number;
  username: string;
  fullName?: string;
  roleName: string;
  email: string;
  createdAt?: string;
  status: string;
  phone?: string;
}

export interface CreateUserPayload {
  username: string;
  password?: string;
  fullName: string;
  role: string;
  email: string;
  phone?: string;
  status?: string;
}

export interface UserState {
  users: User[];
  meta: Meta | null;
  deletedUsers: User[];
  deletedMeta: Meta | null;
  loading: boolean;
  error: string | null;
}

// Params for API get list users
export interface FetchUsersParams {
  keyword?: string;
  status?: string;
  role?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}
