'use client';

import { Users, Crown } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoom } from '@/contexts/RoomContext';

export const Participants = () => {
  const colors = getColors();
  const { participants } = useRoom();

  return (
    <div 
      className="rounded-xl p-3"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Users size={16} style={{ color: colors.primary }} />
        <h3 className="font-semibold text-sm" style={{ color: colors.text.primary }}>
          Participants ({participants.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                style={{ backgroundColor: colors.primary }}
              >
                {participant.name.charAt(0)}
              </div>
              <span className="text-sm" style={{ color: colors.text.secondary }}>
                {participant.name}
              </span>
            </div>
            {participant.isHost && (
              <Crown size={12} style={{ color: colors.primary }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};