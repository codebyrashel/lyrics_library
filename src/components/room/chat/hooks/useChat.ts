import { useState, useEffect, useCallback, useRef } from 'react';
import { wsService } from '@/services/websocket.service';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export const useChat = (roomId: string) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Track processed message IDs to prevent duplicates
  const processedMessageIds = useRef<Set<string>>(new Set());
  const pendingTempIds = useRef<Map<string, string>>(new Map());

  const loadChatHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('[useChat] Loading chat history for room:', roomId);
      console.log('[useChat] Token present:', !!token);
      
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/messages`, {
        headers,
      });
      
      console.log('[useChat] Response status:', response.status);
      
      if (!response.ok) {
        console.error('[useChat] Failed to load history:', response.status);
        setMessages([]);
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('[useChat] Loaded messages:', data.messages?.length || 0);
      
      if (data.success && data.messages) {
        const formattedMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          userId: msg.user_id || msg.userId,
          userName: msg.user_name || msg.userName || (msg.user_id === 'system' ? 'System' : 'User'),
          content: msg.content || '',
          timestamp: new Date(msg.created_at || msg.createdAt || Date.now()),
          isSystem: msg.user_id === 'system' || msg.userId === 'system',
        }));
        
        // Track loaded message IDs
        formattedMessages.forEach(msg => {
          processedMessageIds.current.add(msg.id);
        });
        
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('[useChat] Failed to load chat history:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    loadChatHistory();

    const handleNewMessage = (data: any) => {
      console.log('[useChat] New message received:', data);
      
      // Skip if this message is from current user (already added optimistically)
      if (data.userId === user?.id) {
        console.log('[useChat] Skipping own message from WebSocket');
        return;
      }
      
      // Check if we've already processed this message ID
      if (data.id && processedMessageIds.current.has(data.id)) {
        console.log('[useChat] Duplicate message ID, skipping:', data.id);
        return;
      }
      
      const newMessage: ChatMessage = {
        id: data.id,
        userId: data.userId,
        userName: data.userName || 'User',
        content: data.content || '',
        timestamp: new Date(data.timestamp || Date.now()),
        isSystem: data.isSystem === true || data.userId === 'system',
      };
      
      // Track this message ID
      if (data.id) {
        processedMessageIds.current.add(data.id);
      }
      
      setMessages(prev => {
        // Extra check for duplicate
        if (prev.some(m => m.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    wsService.on('room:message', handleNewMessage);
    wsService.on('chat_message', handleNewMessage);

    return () => {
      wsService.off('room:message', handleNewMessage);
      wsService.off('chat_message', handleNewMessage);
    };
  }, [roomId, user?.id, loadChatHistory]);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('[useChat] No auth token found');
      return;
    }

    const content = message;
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const userId = user?.id || 'unknown';
    const userName = user?.name || 'You';
    
    // Clear input immediately
    setMessage('');
    
    // Track temp ID to prevent duplicate
    processedMessageIds.current.add(tempId);
    
    // Add optimistically
    const optimisticMessage: ChatMessage = {
      id: tempId,
      userId: userId,
      userName: userName,
      content: content,
      timestamp: new Date(),
      isSystem: false,
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Send via WebSocket
    wsService.send('room:message', {
      roomId,
      content: content,
      name: userName,
    });

    // Save to database
    try {
      console.log('[useChat] Sending message to API');
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content }),
      });
      
      console.log('[useChat] API response status:', response.status);
      
      if (!response.ok) {
        console.error('[useChat] Failed to save message:', response.status);
        return;
      }
      
      const data = await response.json();
      console.log('[useChat] Save response:', data);
      
      // Replace temp message with real one
      if (data.success && data.message && data.message.id) {
        const realId = data.message.id;
        
        // Track the real ID
        processedMessageIds.current.add(realId);
        
        // Remove temp ID from tracking
        processedMessageIds.current.delete(tempId);
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? { ...msg, id: realId }
              : msg
          )
        );
      }
    } catch (err) {
      console.error('[useChat] Failed to save message:', err);
    }
  }, [message, roomId, user?.id, user?.name]);

  return { messages, message, isLoading, setMessage, handleSend };
};