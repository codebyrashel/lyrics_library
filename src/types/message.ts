export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isOnline?: boolean;
    lastSeen?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    isFromMe: boolean;
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
}