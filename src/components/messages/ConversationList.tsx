'use client';

import { Conversation } from '@/types/message';
import { getColors } from '@/store/colorStore';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  isLoading: boolean;
}

export const ConversationList = ({ conversations, selectedId, onSelect, isLoading }: ConversationListProps) => {
  const colors = getColors();

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
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv)}
          className={`flex items-center gap-3 p-4 w-full text-left transition-all hover:scale-105 ${
            selectedId === conv.id ? 'bg-opacity-10' : ''
          }`}
          style={{
            backgroundColor: selectedId === conv.id ? `${colors.primary}10` : 'transparent',
            borderBottom: `1px solid ${colors.text.muted}10`,
          }}
        >
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shrink-0 overflow-hidden"
            style={{ backgroundColor: colors.primary }}
          >
            {conv.participant.avatar ? (
              <img src={conv.participant.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              conv.participant.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold truncate" style={{ color: colors.text.primary }}>
                {conv.participant.name}
              </p>
              <span className="text-xs shrink-0" style={{ color: colors.text.muted }}>
                {formatDistanceToNow(new Date(conv.lastMessage.timestamp), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm truncate" style={{ color: conv.unreadCount > 0 ? colors.text.primary : colors.text.muted }}>
              {conv.lastMessage.isFromMe && 'You: '}{conv.lastMessage.content}
            </p>
          </div>

          {/* Unread Badge */}
          {conv.unreadCount > 0 && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white shrink-0"
              style={{ backgroundColor: colors.primary }}
            >
              {conv.unreadCount}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};