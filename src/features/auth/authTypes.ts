export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id?: number;
  username: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// data returned from API login
export interface LoginData {
  token: string;
  username: string;
  role: UserRole;
}
