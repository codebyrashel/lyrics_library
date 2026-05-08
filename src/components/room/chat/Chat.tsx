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

interface ChatProps {
  roomId: string;
}

export const Chat = ({ roomId }: ChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const colors = getColors();
  const { messages, message, isLoading, setMessage, handleSend } = useChat(roomId);
  const isGuest = guestService.isGuest();

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
            currentUserId={null} 
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
      <ChatMessages 
        messages={messages} 
        currentUserId={null} 
        colors={colors} 
        messagesEndRef={messagesEndRef}
      />
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