import axios from 'axios';

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

export interface Friend {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  addedAt: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  name: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export const friendsService = {
  // Get all friends
  async getFriends(): Promise<{ success: boolean; friends?: Friend[]; message?: string }> {
    try {
      const response = await api.get('/friends');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load friends',
      };
    }
  },

  // Get pending friend requests
  async getFriendRequests(): Promise<{ success: boolean; requests?: FriendRequest[]; message?: string }> {
    try {
      const response = await api.get('/friends/requests');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load requests',
      };
    }
  },

  // Send friend request
  async sendFriendRequest(username: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post('/friends/request', { username });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send request',
      };
    }
  },

  // Accept friend request
  async acceptRequest(requestId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.put(`/friends/accept/${requestId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to accept request',
      };
    }
  },

  // Reject friend request
  async rejectRequest(requestId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/friends/reject/${requestId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reject request',
      };
    }
  },

  // Remove friend
  async removeFriend(friendId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/friends/remove/${friendId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove friend',
      };
    }
  },
};