'use client';

import { useRef, useEffect } from 'react';
import { getColors } from '@/store/colorStore';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatLoading } from './ChatLoading';
import { ChatBlocker } from '../ChatBlocker';
import { useChat } from './hooks/useChat';
import { guestService } from '@/services/guest.service';
import { useAuth } from '@/contexts/AuthContext';

interface ChatProps {
  roomId: string;
}

export const Chat = ({ roomId }: ChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const colors = getColors();
  const { messages, message, isLoading, setMessage, handleSend } = useChat(roomId);
  const { user } = useAuth();
  const isGuest = guestService.isGuest();

  // Get the current user ID
  const currentUserId = user?.id || (isGuest ? guestService.getGuestId() : null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return <ChatLoading colors={colors} />;
  }

  // Guest view - show locked chat with blur effect
  if (isGuest) {
    return (
      <div className="relative h-full">
        <div 
          className="flex flex-col h-full rounded-xl opacity-50 pointer-events-none"
          style={{ 
            backgroundColor: colors.surface,
            border: `1px solid ${colors.surface}`
          }}
        >
          <ChatHeader colors={colors} />
          <ChatMessages 
            messages={messages.slice(-10)} 
            currentUserId={currentUserId}
            colors={colors} 
            messagesEndRef={messagesEndRef}
          />
          <ChatInput 
            message={message}
            setMessage={setMessage}
            onSend={handleSend}
            colors={colors}
            isGuest={true}
          />
        </div>
        <ChatBlocker roomId={roomId} />
      </div>
    );
  }

  // Authenticated user view - full chat
  return (
    <div 
      className="flex flex-col h-full rounded-xl"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <ChatHeader colors={colors} />
      <div className="flex-1 overflow-y-auto">
        <ChatMessages 
          messages={messages} 
          currentUserId={currentUserId}
          colors={colors} 
          messagesEndRef={messagesEndRef}
        />
      </div>
      <ChatInput 
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
        colors={colors}
        isGuest={false}
      />
    </div>
  );
};