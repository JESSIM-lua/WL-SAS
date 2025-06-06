import axios from 'axios';
import { ApiResponse, Player } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginWithDiscord = async (): Promise<ApiResponse<{ token: string; user: any }>> => {
  try {
    // In a real application, this would redirect to Discord OAuth
    // For now, we'll simulate a successful login
    const response = await api.get('/auth/discord');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
};

// Players/Applications
export const submitApplication = async (playerData: Omit<Player, 'status' | 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Player>> => {
  try {
    const response = await api.post('/players', playerData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
};

export const getApplications = async (): Promise<ApiResponse<Player[]>> => {
  try {
    const response = await api.get('/players');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
};

export const updateApplicationStatus = async (
  id: number,
  status: 'approved' | 'rejected',
  rejectionReason?: string,
  adminNote?: string
): Promise<ApiResponse<Player>> => {
  try {
    const payload: any = { status };
    if (status === 'rejected') {
      payload.rejectionReason = rejectionReason;
      payload.adminNote = adminNote;
    }

    const response = await api.patch(`/players/${id}`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
};


export const checkApplicationStatus = async (discordId: string): Promise<ApiResponse<Player>> => {
  try {
    const response = await api.get(`/players/status/${discordId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
    return { success: false, error: 'Unknown error occurred' };
  }
};

export default api;