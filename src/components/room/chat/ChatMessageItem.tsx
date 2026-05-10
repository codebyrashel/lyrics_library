import { Info } from 'lucide-react';
import { memo } from 'react';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

interface ChatMessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  colors: any;
}

export const ChatMessageItem = memo(({ message, isCurrentUser, colors }: ChatMessageItemProps) => {
  // System message
  if (message.isSystem === true || message.userId === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div 
          className="px-3 py-1 rounded-full text-xs flex items-center gap-1 max-w-[90%]"
          style={{ 
            backgroundColor: `${colors.primary}10`,
            color: colors.text.muted,
            border: `1px solid ${colors.primary}20`
          }}
        >
          <Info size={12} />
          <span>{message.content || ''}</span>
        </div>
      </div>
    );
  }
  
  // Skip invalid messages
  if (!message.userId || message.userId === 'unknown') {
    return null;
  }
  
  const userName = message.userName || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const messageContent = message.content || '';
  const isTemp = message.id?.startsWith('temp_');
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex items-start gap-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        {!isCurrentUser && (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
            style={{ backgroundColor: colors.primary }}
          >
            {userInitial}
          </div>
        )}
        
        {isCurrentUser && <div className="w-8 shrink-0" />}
        
        <div className="flex-1">
          {!isCurrentUser && (
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xs font-semibold" style={{ color: colors.primary }}>
                {userName}
              </span>
              <span className="text-xs" style={{ color: colors.text.muted }}>
                {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
          )}
          
          {isCurrentUser && (
            <div className="flex items-baseline gap-2 mb-1 justify-end">
              <span className="text-xs" style={{ color: colors.text.muted }}>
                {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
          )}
          
          <div 
            className={`px-3 py-2 rounded-lg text-sm break-words ${
              isCurrentUser 
                ? 'rounded-tr-none' 
                : 'rounded-tl-none'
            } ${isTemp ? 'opacity-70' : ''}`}
            style={{ 
              backgroundColor: isCurrentUser ? colors.primary : `${colors.primary}15`,
              color: isCurrentUser ? 'white' : colors.text.primary,
            }}
          >
            {messageContent}
            {isTemp && <span className="ml-1 text-xs opacity-50">⌛</span>}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessageItem.displayName = 'ChatMessageItem';