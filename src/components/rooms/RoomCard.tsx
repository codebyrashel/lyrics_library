'use client';

import { DoorOpen, Users, Clock, ChevronRight, Crown, Sparkles } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';
import { SavedRoom } from '@/store/savedRoomsStore';

interface RoomCardProps {
  room: SavedRoom;
  onJoin: (roomId: string) => void;
}

export const RoomCard = ({ room, onJoin }: RoomCardProps) => {
  const colors = getColors();
  
  return (
    <div
      className="p-4 rounded-xl cursor-pointer transition-colors"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${room.isActive ? colors.status.success : colors.surface}`,
        boxShadow: room.isActive ? `0 0 0 1px ${colors.status.success}20` : 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = `${colors.surface}80`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors.surface;
      }}
      onClick={() => onJoin(room.id)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <DoorOpen size={18} style={{ color: room.isActive ? colors.status.success : colors.primary }} />
            <h3 className="font-semibold" style={{ color: colors.text.primary }}>
              {room.name}
            </h3>
            {room.isCreator && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
              >
                <Crown size={10} />
                Host
              </span>
            )}
            {room.isActive && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ backgroundColor: `${colors.status.success}15`, color: colors.status.success }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.status.success }} />
                Live
              </span>
            )}
            {room.participantCount && room.participantCount > 5 && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
              >
                <Sparkles size={10} />
                Popular
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-xs" style={{ color: colors.text.muted }}>
            <span>Room ID: {room.id}</span>
            <span>Created: {new Date(room.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span>Last active: {new Date(room.lastVisited).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          
          {room.isActive && room.participantCount && room.participantCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                {[...Array(Math.min(room.participantCount, 3))].map((_, i) => (
                  <div 
                    key={i}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white border-2"
                    style={{ 
                      backgroundColor: colors.primary,
                      borderColor: colors.surface
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-xs" style={{ color: colors.text.muted }}>
                {room.participantCount} {room.participantCount === 1 ? 'person' : 'people'} watching
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {room.participantCount && room.participantCount > 0 && (
            <div 
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
            >
              <Users size={14} />
              <span>{room.participantCount}</span>
            </div>
          )}
          <Button variant="primary" className="px-4! py-1.5! inline-flex items-center">
            {room.isActive ? 'Join Now' : 'Rejoin Room'}
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};