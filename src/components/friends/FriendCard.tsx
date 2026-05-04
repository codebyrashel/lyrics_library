'use client';

import { useRouter } from 'next/navigation';
import { User, MessageCircle, UserMinus, Video } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import Image from 'next/image';

interface FriendCardProps {
  id: string;
  name: string;
  username: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  onMessage: () => void;
  onInvite: () => void;
  onRemove: () => void;
}

export const FriendCard = ({ id, name, username, status, avatar, onMessage, onInvite, onRemove }: FriendCardProps) => {
  const router = useRouter();
  const colors = getColors();
  
  const statusColors = {
    online: '#10B981',
    offline: '#6B7280',
    away: '#F59E0B'
  };
  
  const statusText = {
    online: 'Online',
    offline: 'Offline',
    away: 'Away'
  };

  const handleMessage = () => {
    // Navigate to messages page with friend ID in query param
    router.push(`/dashboard/messages?friendId=${id}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}`);
    onMessage();
  };
  
  return (
    <div 
      className="p-4 rounded-xl transition-all hover:scale-105"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar with status indicator */}
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
            style={{ backgroundColor: colors.primary }}
          >
            {avatar ? (
              <Image src={avatar} alt={name} width={100} height={100} unoptimized className="w-full h-full rounded-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <div 
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
            style={{ 
              backgroundColor: statusColors[status],
              borderColor: colors.surface
            }}
          />
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold" style={{ color: colors.text.primary }}>
            {name}
          </h3>
          <p className="text-xs" style={{ color: statusColors[status] }}>
            {statusText[status]}
          </p>
          <p className="text-xs mt-0.5" style={{ color: colors.text.muted }}>
            @{username}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={handleMessage}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ color: colors.text.secondary }}
            title="Send Message"
          >
            <MessageCircle size={16} />
          </button>
          <button
            onClick={onInvite}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ color: colors.text.secondary }}
            title="Invite to Room"
          >
            <Video size={16} />
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ color: colors.status.error }}
            title="Remove Friend"
          >
            <UserMinus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};