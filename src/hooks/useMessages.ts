'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { messageService } from '@/services/message.service';
import { wsService } from '@/services/websocket.service';
import { Conversation, Message } from '@/types/message';

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const isInitialLoadDone = useRef(false);
  const isLoadingConversationsRef = useRef(false);
  const currentOpenConversationId = useRef<string | null>(null);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (isLoadingConversationsRef.current) return;
    isLoadingConversationsRef.current = true;
    
    const response = await messageService.getConversations();
    if (response.success && response.conversations) {
      setConversations(response.conversations);
    }
    setIsLoadingConversations(false);
    isLoadingConversationsRef.current = false;
  }, []);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    if (conversationId.startsWith('temp-')) return;
    
    setIsLoadingMessages(true);
    const response = await messageService.getMessages(conversationId);
    if (response.success && response.messages) {
      setMessages(response.messages);
    }
    setIsLoadingMessages(false);
  }, []);

  // Mark ALL messages in a conversation as read
  const markConversationAsRead = useCallback(async (conversationId: string) => {
    if (conversationId.startsWith('temp-')) return;
    await messageService.markAsRead(conversationId);
    // Update unread count in conversations list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  }, []);

  // Select a conversation - marks all messages as read
  const selectConversation = useCallback(async (conversation: Conversation) => {
    currentOpenConversationId.current = conversation.id;
    setSelectedConversation(conversation);
    
    if (!conversation.id.startsWith('temp-')) {
      await loadMessages(conversation.id);
      await markConversationAsRead(conversation.id);
    } else {
      setMessages([]);
    }
  }, [loadMessages, markConversationAsRead]);

  // Send a message
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    const response = await messageService.sendMessage({ receiverId, content });
    if (response.success && response.message) {
      // Add to messages list
      setMessages(prev => [...prev, response.message!]);
      // Update conversations list last message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversation?.id
            ? {
                ...conv,
                lastMessage: {
                  content: content,
                  timestamp: new Date().toISOString(),
                  isRead: true,
                  isFromMe: true,
                },
                unreadCount: 0
              }
            : conv
        )
      );
      return true;
    }
    return false;
  }, [selectedConversation]);

  // Start a new conversation
  const startConversation = useCallback((friendId: string, friendName: string, friendUsername: string) => {
    currentOpenConversationId.current = `temp-${friendId}`;
    
    const existingConv = conversations.find(c => c.participant.id === friendId);
    if (existingConv) {
      selectConversation(existingConv);
      return existingConv;
    }
    
    const tempConversation: Conversation = {
      id: `temp-${friendId}`,
      participant: {
        id: friendId,
        name: friendName,
        username: friendUsername,
        status: 'offline',
        isOnline: false,
      },
      lastMessage: {
        content: 'Send a message to start the conversation',
        timestamp: new Date().toISOString(),
        isRead: true,
        isFromMe: false,
      },
      unreadCount: 0,
    };
    
    setConversations(prev => [tempConversation, ...prev]);
    setSelectedConversation(tempConversation);
    setMessages([]);
    return tempConversation;
  }, [conversations, selectConversation]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    // Handler for new messages
    const handleNewMessage = (data: any) => {
      const isCurrentConversation = currentOpenConversationId.current === data.conversationId;
      
      if (isCurrentConversation) {
        // User is currently viewing this conversation - just add the message, no unread count
        setMessages(prev => [...prev, data]);
      } else {
        // User is not viewing this conversation - increment unread count
        setConversations(prev =>
          prev.map(conv =>
            conv.id === data.conversationId
              ? {
                  ...conv,
                  lastMessage: {
                    content: data.content,
                    timestamp: data.timestamp,
                    isRead: false,
                    isFromMe: false,
                  },
                  unreadCount: (conv.unreadCount || 0) + 1
                }
              : conv
          )
        );
      }
    };

    // Handler for status changes
    const handleStatusChange = (data: any) => {
      console.log('[DEBUG] Status changed event:', data);
      
      // Update conversation participant status
      setConversations(prev =>
        prev.map(conv =>
          conv.participant.id === data.userId
            ? {
                ...conv,
                participant: {
                  ...conv.participant,
                  status: data.status,
                  isOnline: data.status === 'online',
                }
              }
            : conv
        )
      );
      
      // Also update selected conversation if it's the same user
      if (selectedConversation?.participant.id === data.userId) {
        setSelectedConversation(prev => prev ? {
          ...prev,
          participant: {
            ...prev.participant,
            status: data.status,
            isOnline: data.status === 'online',
          }
        } : null);
      }
    };

    wsService.on('new_message', handleNewMessage);
    wsService.on('status_changed', handleStatusChange);
    
    return () => {
      wsService.off('new_message', handleNewMessage);
      wsService.off('status_changed', handleStatusChange);
    };
  }, [selectedConversation]);

  // Initial load
  useEffect(() => {
    if (!isInitialLoadDone.current) {
      isInitialLoadDone.current = true;
      loadConversations();
      if (!wsService.isConnected()) {
        wsService.connect();
      }
    }
  }, [loadConversations]);

  return {
    conversations,
    selectedConversation,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    selectConversation,
    sendMessage,
    startConversation,
    refreshConversations: loadConversations,
  };
};