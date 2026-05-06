import axios from 'axios';
import { Conversation, Message, SendMessageRequest } from '@/types/message';

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

export const messageService = {
  // Get all conversations for current user
  async getConversations(): Promise<{ success: boolean; conversations?: Conversation[]; message?: string }> {
    try {
      console.log('[DEBUG] Getting conversations...');
      const response = await api.get('/messages/conversations');
      console.log('[DEBUG] Conversations response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[DEBUG] Get conversations error:', error.response?.status, error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load conversations',
      };
    }
  },

  // Get messages for a specific conversation
  async getMessages(conversationId: string): Promise<{ success: boolean; messages?: Message[]; message?: string }> {
    try {
      console.log('[DEBUG] Getting messages for conversation:', conversationId);
      const response = await api.get(`/messages/conversations/${conversationId}`);
      console.log('[DEBUG] Messages response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[DEBUG] Get messages error:', error.response?.status, error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to load messages',
      };
    }
  },

  // Send a message
  async sendMessage(data: SendMessageRequest): Promise<{ success: boolean; message?: Message; error?: string }> {
    try {
      console.log('[DEBUG] Sending message:', data);
      const response = await api.post('/messages/send', data);
      console.log('[DEBUG] Send message response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[DEBUG] Send message error:', error.response?.status, error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message',
      };
    }
  },

  // Mark messages as read
  async markAsRead(conversationId: string): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('[DEBUG] Marking conversation as read:', conversationId);
      const response = await api.put(`/messages/conversations/${conversationId}/read`);
      console.log('[DEBUG] Mark as read response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[DEBUG] Mark as read error:', error.response?.status, error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark as read',
      };
    }
  },
};