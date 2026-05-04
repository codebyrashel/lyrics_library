'use client';

import { User, Check, X } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import Image from 'next/image';

interface FriendRequestCardProps {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  onAccept: () => void;
  onReject: () => void;
}

export const FriendRequestCard = ({ name, username, avatar, onAccept, onReject }: FriendRequestCardProps) => {
  const colors = getColors();
  
  return (
    <div 
      className="p-4 rounded-xl transition-all hover:scale-105"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
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
        
        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold" style={{ color: colors.text.primary }}>
            {name}
          </h3>
          <p className="text-sm" style={{ color: colors.text.muted }}>
            @{username}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: `${colors.status.success}15`, color: colors.status.success }}
          >
            <Check size={18} />
          </button>
          <button
            onClick={onReject}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: `${colors.status.error}15`, color: colors.status.error }}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};