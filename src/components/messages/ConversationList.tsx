'use client';

import { Conversation } from '@/types/message';
import { getColors } from '@/store/colorStore';
import { formatDistanceToNow } from 'date-fns';
import { Circle, Clock, MinusCircle, EyeOff } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  isLoading: boolean;
}

const getStatusIcon = (status: string, color: string) => {
  switch (status) {
    case 'online':
      return <Circle size={10} fill={color} stroke={color} />;
    case 'idle':
      return <Clock size={10} style={{ color }} />;
    case 'dnd':
      return <MinusCircle size={10} style={{ color }} />;
    default:
      return <EyeOff size={10} style={{ color }} />;
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

export const ConversationList = ({ conversations, selectedId, onSelect, isLoading }: ConversationListProps) => {
  const colors = getColors();

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: colors.primary }} />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <p className="text-sm" style={{ color: colors.text.muted }}>No messages yet</p>
        <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
          Start a conversation from your friends list
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {conversations.map((conv) => {
        const status = conv.participant.status || 'offline';
        const statusColor = getStatusColor(status);
        const statusText = getStatusText(status);
        
        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`flex items-center gap-3 p-4 w-full text-left transition-colors ${
              selectedId === conv.id ? 'bg-opacity-10' : ''
            }`}
            style={{
              backgroundColor: selectedId === conv.id ? `${colors.primary}10` : 'transparent',
              borderBottom: `1px solid ${colors.text.muted}10`,
            }}
            onMouseEnter={(e) => {
              if (selectedId !== conv.id) {
                e.currentTarget.style.backgroundColor = `${colors.text.muted}5`;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedId !== conv.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {/* Avatar with Status */}
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden"
                style={{ backgroundColor: colors.primary }}
              >
                {conv.participant.avatar ? (
                  <img src={conv.participant.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  conv.participant.name.charAt(0).toUpperCase()
                )}
              </div>
              <div 
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                style={{ 
                  backgroundColor: colors.surface,
                  borderColor: colors.surface
                }}
              >
                {getStatusIcon(status, statusColor)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold truncate" style={{ color: colors.text.primary }}>
                  {conv.participant.name}
                </p>
                <span className="text-xs shrink-0" style={{ color: colors.text.muted }}>
                  {formatTimestamp(conv.lastMessage.timestamp)}
                </span>
              </div>
              <p className="text-sm truncate" style={{ color: colors.text.muted }}>
                {conv.lastMessage.isFromMe && 'You: '}{conv.lastMessage.content}
              </p>
              <p className="text-xs mt-0.5" style={{ color: statusColor }}>
                {statusText}
              </p>
            </div>

            {/* Unread Badge */}
            {conv.unreadCount > 0 && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                style={{ backgroundColor: colors.status.error }}
              >
                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};