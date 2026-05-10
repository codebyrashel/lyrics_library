import { Send, Lock } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';

interface ChatInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
  colors: any;
  isGuest?: boolean;
}

export const ChatInput = ({ message, setMessage, onSend, colors, isGuest = false }: ChatInputProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGuest && message.trim()) {
        onSend();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Optional: Add typing indicator logic here if needed
    if (!isTyping) {
      setIsTyping(true);
      // You could send a "typing" event via WebSocket here
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to clear typing status
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  // Guest view - show locked input
  if (isGuest) {
    return (
      <div className="p-3 border-t" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex gap-2 items-center">
          <div 
            className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            style={{ 
              backgroundColor: colors.background,
              color: colors.text.muted,
              border: `1px solid ${colors.text.muted}20`
            }}
          >
            <Lock size={14} />
            <span>Login to chat</span>
          </div>
          <ChatSendButton onSend={onSend} isDisabled={true} colors={colors} />
        </div>
      </div>
    );
  }

  // Authenticated view - full input
  return (
    <div className="p-3 border-t flex gap-2" style={{ borderColor: `${colors.text.muted}20` }}>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
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
      <ChatSendButton onSend={onSend} isDisabled={!message.trim()} colors={colors} />
    </div>
  );
};

const ChatSendButton = ({ onSend, isDisabled, colors }: { onSend: () => void; isDisabled: boolean; colors: any }) => (
  <button
    onClick={onSend}
    disabled={isDisabled}
    className="p-2 rounded-lg transition-colors hover:bg-opacity-80 disabled:opacity-50"
    style={{ backgroundColor: colors.primary, color: 'white' }}
  >
    <Send size={16} />
  </button>
);