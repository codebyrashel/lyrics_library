import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { getColors } from '@/store/colorStore';

interface AddFriendCardProps {
  onSendRequest: (username: string) => void;
  isLoading: boolean;
  colors?: any;
}

export function AddFriendCard({ onSendRequest, isLoading, colors: propColors }: AddFriendCardProps) {
  const [username, setUsername] = useState('');
  const colors = propColors || getColors();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSendRequest(username.trim());
      setUsername('');
    }
  };

  return (
    <div className="mb-8 p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to add friend..."
          className="flex-1 px-4 py-2 rounded-lg outline-none"
          style={{
            backgroundColor: colors.background,
            color: colors.text.primary,
            border: `1px solid ${colors.text.muted}30`
          }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !username.trim()}
          className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: colors.primary, color: 'white' }}
        >
          <UserPlus size={18} />
          {isLoading ? 'Sending...' : 'Add Friend'}
        </button>
      </form>
    </div>
  );
}