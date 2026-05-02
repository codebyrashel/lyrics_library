import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

// Create axios instance with base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,  
      });
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Logout user
  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    // Optional: Call logout endpoint if needed
    // await api.post('/auth/logout');
  },

  // Get current user
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get user',
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};