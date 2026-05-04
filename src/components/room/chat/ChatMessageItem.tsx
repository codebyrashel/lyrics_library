interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

interface ChatMessageItemProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  colors: any;
}

export const ChatMessageItem = ({ message, isCurrentUser, colors }: ChatMessageItemProps) => {
  return (
    <div className={`flex items-start gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      <ChatAvatar userName={message.userName} colors={colors} />
      <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
        <ChatUserName name={message.userName} isCurrentUser={isCurrentUser} colors={colors} />
        <p className="text-sm mt-0.5" style={{ color: colors.text.secondary }}>
          {message.content}
        </p>
        <ChatTimestamp timestamp={message.timestamp} colors={colors} />
      </div>
    </div>
  );
};

const ChatAvatar = ({ userName, colors }: { userName: string; colors: any }) => (
  <div 
    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
    style={{ backgroundColor: colors.primary }}
  >
    {userName.charAt(0).toUpperCase()}
  </div>
);

const ChatUserName = ({ name, isCurrentUser, colors }: { name: string; isCurrentUser: boolean; colors: any }) => (
  <span className="text-xs font-semibold" style={{ color: colors.primary }}>
    {name}
    {isCurrentUser && ' (You)'}
  </span>
);

const ChatTimestamp = ({ timestamp, colors }: { timestamp: Date; colors: any }) => (
  <span className="text-xs" style={{ color: colors.text.muted }}>
    {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </span>
);