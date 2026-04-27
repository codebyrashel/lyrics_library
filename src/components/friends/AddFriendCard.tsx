'use client';

import { useState } from 'react';
import { UserPlus, Search, X } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';

interface AddFriendCardProps {
  onSendRequest: (username: string) => void;
  isLoading: boolean;
}

export const AddFriendCard = ({ onSendRequest, isLoading }: AddFriendCardProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const colors = getColors();
  
  const handleSubmit = () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    setError('');
    onSendRequest(username);
    setUsername('');
  };
  
  return (
    <div 
      className="p-6 rounded-xl"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${colors.primary}15` }}
        >
          <UserPlus size={20} style={{ color: colors.primary }} />
        </div>
        <div>
          <h3 className="font-semibold" style={{ color: colors.text.primary }}>
            Add Friend
          </h3>
          <p className="text-sm" style={{ color: colors.text.muted }}>
            Send a friend request by username
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: colors.text.muted }}
          />
          <input
            type="text"
            placeholder="Enter username (e.g., john_doe)"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.background,
              border: error ? `1px solid ${colors.status.error}` : `1px solid ${colors.text.muted}30`,
              color: colors.text.primary
            }}
          />
          {username && (
            <button
              onClick={() => setUsername('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X size={14} style={{ color: colors.text.muted }} />
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs" style={{ color: colors.status.error }}>{error}</p>
        )}
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Friend Request'}
        </Button>
      </div>
    </div>
  );
};