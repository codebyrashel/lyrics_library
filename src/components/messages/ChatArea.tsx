'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Message, Conversation } from '@/types/message';
import { getColors } from '@/store/colorStore';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatArea = ({ conversation, messages, onSendMessage, isLoading }: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const colors = getColors();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    await onSendMessage(newMessage);
    setNewMessage('');
    setIsSending(false);
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p style={{ color: colors.text.muted }}>Select a conversation to start messaging</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: colors.primary }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="p-4 border-b"
        style={{ borderColor: `${colors.text.muted}20`, backgroundColor: colors.surface }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: colors.primary }}
          >
            {conversation.participant.avatar ? (
              <Image src={conversation.participant.avatar} alt="" width={100} height={100} className="w-full h-full object-cover rounded-full" />
            ) : (
              conversation.participant.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold" style={{ color: colors.text.primary }}>
              {conversation.participant.name}
            </p>
            <p className="text-xs" style={{ color: conversation.participant.isOnline ? colors.status.success : colors.text.muted }}>
              {conversation.participant.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isFromMe = msg.senderId !== conversation.participant.id;
          return (
            <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  isFromMe ? 'rounded-br-none' : 'rounded-bl-none'
                }`}
                style={{
                  backgroundColor: isFromMe ? colors.primary : colors.surface,
                  color: isFromMe ? 'white' : colors.text.primary,
                }}
              >
                <p className="text-sm wrap-break-word">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isFromMe ? 'text-white/70' : ''
                  }`}
                  style={!isFromMe ? { color: colors.text.muted } : undefined}
                >
                  {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.text.muted}30`,
              color: colors.text.primary,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="p-2 rounded-lg transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: colors.primary, color: 'white' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};