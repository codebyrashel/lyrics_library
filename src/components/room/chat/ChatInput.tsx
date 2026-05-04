import { Send } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
  colors: any;
}

export const ChatInput = ({ message, setMessage, onSend, colors }: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-3 border-t flex gap-2" style={{ borderColor: `${colors.text.muted}20` }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.text.muted}30`,
          color: colors.text.primary,
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