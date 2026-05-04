'use client';

import { useRef, useEffect } from 'react';
import { getColors } from '@/store/colorStore';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatLoading } from './ChatLoading';
import { useChat } from './hooks/useChat';

interface ChatProps {
  roomId: string;
}

export const Chat = ({ roomId }: ChatProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const colors = getColors();
  const { messages, message, isLoading, setMessage, handleSend } = useChat(roomId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return <ChatLoading colors={colors} />;
  }

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
      />
    </div>
  );
};