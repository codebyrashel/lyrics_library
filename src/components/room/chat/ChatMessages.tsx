import { ChatMessageItem } from './ChatMessageItem';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  currentUserId: string | null;
  colors: any;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessages = ({ messages, currentUserId, colors, messagesEndRef }: ChatMessagesProps) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: colors.text.muted }}>No messages yet</p>
          <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
            Be the first to send a message
          </p>
        </div>
        <div ref={messagesEndRef} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {messages.map((msg) => (
        <ChatMessageItem 
          key={msg.id}
          message={msg}
          isCurrentUser={msg.userId === currentUserId}
          colors={colors}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};