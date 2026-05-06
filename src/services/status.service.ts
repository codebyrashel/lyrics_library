import axios from 'axios';
import { UserStatus } from '@/types/status';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const statusService = {
  async updateStatus(status: UserStatus, durationMinutes?: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.put('/users/status', { status, durationMinutes });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update status',
      };
    }
  },

  async getStatus(): Promise<{ success: boolean; status?: UserStatus; expiry?: string; lastSeen?: string }> {
    try {
      const response = await api.get('/users/status');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
      };
    }
  },
};