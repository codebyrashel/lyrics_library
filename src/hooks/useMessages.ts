'use client';

import { useState, useEffect, useCallback } from 'react';
import { messageService } from '@/services/message.service';
import { wsService } from '@/services/websocket.service';
import { Conversation, Message } from '@/types/message';

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [newMessageReceived, setNewMessageReceived] = useState(false);

  // Load conversations
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    const response = await messageService.getConversations();
    if (response.success && response.conversations) {
      setConversations(response.conversations);
    }
    setIsLoadingConversations(false);
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    const response = await messageService.getMessages(conversationId);
    if (response.success && response.messages) {
      setMessages(response.messages);
      // Mark as read
      await messageService.markAsRead(conversationId);
    }
    setIsLoadingMessages(false);
  }, []);

  // Select a conversation
  const selectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
  }, [loadMessages]);

  // Send a message
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    const response = await messageService.sendMessage({ receiverId, content });
    if (response.success && response.message) {
      // Add message to local state
      setMessages(prev => [...prev, response.message!]);
      
      // Update conversation list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation?.id
            ? {
                ...conv,
                lastMessage: {
                  content,
                  timestamp: new Date().toISOString(),
                  isRead: false,
                  isFromMe: true,
                },
              }
            : conv
        )
      );
      return true;
    }
    return false;
  }, [selectedConversation]);

  // Start a new conversation with a friend
  const startConversation = useCallback(async (friendId: string, friendName: string, friendUsername: string) => {
    // Check if conversation already exists
    const existing = conversations.find(c => c.participant.id === friendId);
    if (existing) {
      selectConversation(existing);
      return existing;
    }

    // Create a temporary conversation (will be replaced by backend when message is sent)
    const tempConversation: Conversation = {
      id: `temp-${friendId}`,
      participant: {
        id: friendId,
        name: friendName,
        username: friendUsername,
        isOnline: false,
      },
      lastMessage: {
        content: '',
        timestamp: new Date().toISOString(),
        isRead: true,
        isFromMe: false,
      },
      unreadCount: 0,
    };
    
    setConversations(prev => [tempConversation, ...prev]);
    selectConversation(tempConversation);
    return tempConversation;
  }, [conversations, selectConversation]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      const newMsg = data as Message;
      
      // If this message is for the current conversation, add it
      if (selectedConversation?.id === newMsg.conversationId) {
        setMessages(prev => [...prev, newMsg]);
        // Mark as read
        messageService.markAsRead(newMsg.conversationId);
      }
      
      // Refresh conversations to update last message and unread count
      loadConversations();
      setNewMessageReceived(true);
    };

    wsService.on('new_message', handleNewMessage);
    
    return () => {
      wsService.off('new_message', handleNewMessage);
    };
  }, [selectedConversation, loadConversations]);

  // Initial load
  useEffect(() => {
    loadConversations();
    
    // Connect WebSocket if not already connected
    if (!wsService.isConnected()) {
      wsService.connect();
    }
  }, [loadConversations]);

  return {
    conversations,
    selectedConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    newMessageReceived,
    selectConversation,
    sendMessage,
    startConversation,
    refreshConversations: loadConversations,
  };
};