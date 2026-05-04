import { useState, useEffect } from 'react';
import { wsService } from '@/services/websocket.service';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export const useChat = (roomId: string) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChatHistory();

    const handleNewMessage = (data: any) => {
      setMessages(prev => [...prev, {
        id: data.id,
        userId: data.userId,
        userName: data.userName,
        content: data.content,
        timestamp: new Date(data.timestamp),
      }]);
    };

    wsService.on('room:message', handleNewMessage);

    return () => {
      wsService.off('room:message', handleNewMessage);
    };
  }, [roomId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    wsService.send('room:message', {
      roomId,
      content: message,
    });

    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`http://localhost:8080/api/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: message }),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }

    setMessage('');
  };

  return { messages, message, isLoading, setMessage, handleSend };
};