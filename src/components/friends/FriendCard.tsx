'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { User, MessageCircle, UserMinus, Video, Circle, Clock, MinusCircle, EyeOff } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import Image from 'next/image';
import { wsService } from '@/services/websocket.service';

interface FriendCardProps {
  id: string;
  name: string;
  username: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  avatar?: string;
  onMessage: () => void;
  onInvite: () => void;
  onRemove: () => void;
}

const getStatusIcon = (status: string, color: string) => {
  switch (status) {
    case 'online':
      return <Circle size={12} fill={color} stroke={color} />;
    case 'idle':
      return <Clock size={12} style={{ color }} />;
    case 'dnd':
      return <MinusCircle size={12} style={{ color }} />;
    default:
      return <EyeOff size={12} style={{ color }} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return '#10B981';
    case 'idle': return '#F59E0B';
    case 'dnd': return '#EF4444';
    default: return '#6B7280';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'online': return 'Online';
    case 'idle': return 'Idle';
    case 'dnd': return 'Do Not Disturb';
    default: return 'Offline';
  }
};

export const FriendCard = ({ id, name, username, status: initialStatus, avatar, onMessage, onInvite, onRemove }: FriendCardProps) => {
  const router = useRouter();
  const colors = getColors();
  const [status, setStatus] = useState(initialStatus);
  const hasInitialized = useRef(false);

  // Only set initial status on first mount
  useEffect(() => {
    if (!hasInitialized.current && initialStatus) {
      setStatus(initialStatus);
      hasInitialized.current = true;
    }
  }, [initialStatus]);

  // Listen for status changes from WebSocket
  useEffect(() => {
    const handleStatusChange = (data: any) => {
      if (data.userId === id) {
        setStatus(data.status);
      }
    };

    wsService.on('status_changed', handleStatusChange);
    
    return () => {
      wsService.off('status_changed', handleStatusChange);
    };
  }, [id]);

  const statusColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status, statusColor);
  const statusText = getStatusText(status);

  const handleMessage = () => {
    router.push(`/dashboard/messages?friendId=${id}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}`);
    onMessage();
  };
  
  return (
    <div 
      className="p-4 rounded-xl transition-colors cursor-pointer"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${colors.text.muted}10`;
        e.currentTarget.style.borderColor = `${colors.primary}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.surface;
        e.currentTarget.style.borderColor = colors.surface;
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar with status indicator */}
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white overflow-hidden"
            style={{ backgroundColor: colors.primary }}
          >
            {avatar ? (
              <Image src={avatar} alt={name} width={48} height={48} unoptimized className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <div 
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
            style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.surface
            }}
          >
            {statusIcon}
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold" style={{ color: colors.text.primary }}>
            {name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: statusColor }}>
            {statusText}
          </p>
          <p className="text-xs" style={{ color: colors.text.muted }}>
            @{username}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={handleMessage}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text.secondary }}
            title="Send Message"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.primary}15`;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <MessageCircle size={16} />
          </button>
          <button
            onClick={onInvite}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text.secondary }}
            title="Invite to Room"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.primary}15`;
              e.currentTarget.style.color = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <Video size={16} />
          </button>
          <button
            onClick={onRemove}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.status.error }}
            title="Remove Friend"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.status.error}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <UserMinus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};