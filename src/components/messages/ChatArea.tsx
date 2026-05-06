'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Circle, Clock, MinusCircle, EyeOff } from 'lucide-react';
import { Message, Conversation } from '@/types/message';
import { getColors } from '@/store/colorStore';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

const getStatusIcon = (status: string, color: string, size: number) => {
  switch (status) {
    case 'online':
      return <Circle size={size} fill={color} stroke={color} />;
    case 'idle':
      return <Clock size={size} style={{ color }} />;
    case 'dnd':
      return <MinusCircle size={size} style={{ color }} />;
    default:
      return <EyeOff size={size} style={{ color }} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return '#10B981';
    case 'idle': return '#F59E0B';
    case 'dnd': return '#EF4444';
    default: return '#6B7280';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'online': return 'Online';
    case 'idle': return 'Idle';
    case 'dnd': return 'Do Not Disturb';
    default: return 'Offline';
  }
};

export const ChatArea = ({ conversation, messages, onSendMessage, isLoading }: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const colors = getColors();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversation) {
      setTimeout(scrollToBottom, 100);
    }
  }, [conversation?.id]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, 'h:mm a');
    }
    return format(date, 'MMM d, h:mm a');
  };

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    await onSendMessage(newMessage);
    setNewMessage('');
    setIsSending(false);
    setTimeout(scrollToBottom, 100);
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

  const status = conversation.participant.status || 'offline';
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="p-4 border-b"
        style={{ borderColor: `${colors.text.muted}20`, backgroundColor: colors.surface }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden"
              style={{ backgroundColor: colors.primary }}
            >
              {conversation.participant.avatar ? (
                <Image src={conversation.participant.avatar} alt="" width={100} height={100} unoptimized className="w-full h-full object-cover" />
              ) : (
                conversation.participant.name.charAt(0).toUpperCase()
              )}
            </div>
            <div 
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 flex items-center justify-center"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.surface
              }}
            >
              {getStatusIcon(status, statusColor, 8)}
            </div>
          </div>
          <div>
            <p className="font-semibold" style={{ color: colors.text.primary }}>
              {conversation.participant.name}
            </p>
            <p className="text-xs" style={{ color: statusColor }}>
              {statusText}
            </p>
          </div>
        </div>
      </div>

      {/* Messages - same as before */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: colors.text.muted }}>No messages yet</p>
            <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isFromMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[70%] ${isFromMe ? 'flex-row-reverse' : ''}`}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 overflow-hidden"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {isFromMe ? (
                      user?.avatar ? (
                        <Image src={user.avatar} alt="" width={100} height={100} unoptimized className="w-full h-full object-cover" />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() || 'U'
                      )
                    ) : (
                      conversation.participant.avatar ? (
                        <Image src={conversation.participant.avatar} alt="" width={100} height={100} unoptimized className="w-full h-full object-cover" />
                      ) : (
                        conversation.participant.name.charAt(0).toUpperCase()
                      )
                    )}
                  </div>
                  
                  <div>
                    <div
                      className={`p-3 rounded-lg ${
                        isFromMe ? 'rounded-br-none' : 'rounded-bl-none'
                      }`}
                      style={{
                        backgroundColor: isFromMe ? colors.primary : `${colors.primary}10`,
                        color: isFromMe ? 'white' : colors.text.primary,
                        border: !isFromMe ? `1px solid ${colors.primary}20` : 'none',
                      }}
                    >
                      <p className="text-sm wrap-break-word">{msg.content}</p>
                    </div>
                    <p
                      className={`text-xs mt-1 ${
                        isFromMe ? 'text-right' : 'text-left'
                      }`}
                      style={{ color: colors.text.muted }}
                    >
                      {formatMessageTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - same as before */}
      <div className="p-4 border-t" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.text.muted}30`,
              color: colors.text.primary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 2px ${colors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${colors.text.muted}30`;
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            className="p-2 rounded-lg transition-all disabled:opacity-50 hover:scale-105"
            style={{ backgroundColor: colors.primary, color: 'white' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};