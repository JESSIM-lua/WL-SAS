export interface Player {
  id?: number;
  rpName: string;
  rpSurname: string;
  backgroundLink: string;
  discordId: string;
  status: ApplicationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Admin {
  id?: number;
  discordId: string;
  discordRoles: string[];
  username?: string;
  avatarUrl?: string;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Admin | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}