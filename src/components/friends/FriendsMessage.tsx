import { AlertCircle } from 'lucide-react';

interface FriendsMessageProps {
  message: { type: 'success' | 'error'; text: string };
  colors: any;
}

export function FriendsMessage({ message, colors }: FriendsMessageProps) {
  return (
    <div 
      className="p-3 rounded-lg mb-6 flex items-center gap-2"
      style={{ 
        backgroundColor: message.type === 'success' ? `${colors.status.success}15` : `${colors.status.error}15`,
        border: `1px solid ${message.type === 'success' ? colors.status.success : colors.status.error}30`
      }}
    >
      <AlertCircle size={16} style={{ color: message.type === 'success' ? colors.status.success : colors.status.error }} />
      <p className="text-sm" style={{ color: message.type === 'success' ? colors.status.success : colors.status.error }}>
        {message.text}
      </p>
    </div>
  );
}