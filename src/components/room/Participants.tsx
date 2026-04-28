'use client';

import { Users, Crown, Mic, MicOff, Headphones } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';

export const Participants = () => {
  const colors = getColors();
  const { participants } = useRoomStore();

  // Dummy participants for demo
  const dummyParticipants = [
    { id: '1', name: 'You', isHost: true, isSpeaking: false, avatar: 'JD' },
    { id: '2', name: 'Sarah Johnson', isHost: false, isSpeaking: true, avatar: 'SJ' },
    { id: '3', name: 'Michael Chen', isHost: false, isSpeaking: false, avatar: 'MC' },
    { id: '4', name: 'Emma Rodriguez', isHost: false, isSpeaking: false, avatar: 'ER' },
    { id: '5', name: 'David Kim', isHost: false, isSpeaking: false, avatar: 'DK' },
    { id: '6', name: 'Lisa Thompson', isHost: false, isSpeaking: false, avatar: 'LT' },
    { id: '7', name: 'Alex Morgan', isHost: false, isSpeaking: false, avatar: 'AM' },
    { id: '8', name: 'Noah Williams', isHost: false, isSpeaking: true, avatar: 'NW' },
    { id: '9', name: 'Olivia Brown', isHost: false, isSpeaking: false, avatar: 'OB' },
    { id: '10', name: 'Ethan Davis', isHost: false, isSpeaking: false, avatar: 'ED' },
    { id: '11', name: 'Sophia Martinez', isHost: false, isSpeaking: false, avatar: 'SM' },
    { id: '12', name: 'James Wilson', isHost: false, isSpeaking: false, avatar: 'JW' },
    { id: '13', name: 'Ava Anderson', isHost: false, isSpeaking: false, avatar: 'AA' },
    { id: '14', name: 'Benjamin Taylor', isHost: false, isSpeaking: false, avatar: 'BT' },
    { id: '15', name: 'Isabella Thomas', isHost: false, isSpeaking: false, avatar: 'IT' },
    { id: '16', name: 'Lucas Martin', isHost: false, isSpeaking: false, avatar: 'LM' },
    { id: '17', name: 'Mia Garcia', isHost: false, isSpeaking: false, avatar: 'MG' },
    { id: '18', name: 'Henry Lee', isHost: false, isSpeaking: false, avatar: 'HL' },
  ];

  const allParticipants = dummyParticipants;

  return (
    <div 
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{ 
        backgroundColor: colors.surface,
        border: `1px solid ${colors.surface}`
      }}
    >
      <div className="p-3 border-b shrink-0" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex items-center gap-2">
          <Users size={16} style={{ color: colors.primary }} />
          <h3 className="font-semibold" style={{ color: colors.text.primary }}>
            Participants ({allParticipants.length})
          </h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {allParticipants.map((participant) => (
          <div 
            key={participant.id} 
            className="flex items-center justify-between p-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: participant.isSpeaking ? `${colors.primary}15` : colors.background,
              border: participant.isSpeaking ? `1px solid ${colors.primary}30` : 'none'
            }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="relative">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                  style={{ backgroundColor: colors.primary }}
                >
                  {participant.avatar}
                </div>
                {participant.isSpeaking && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.status.success }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>
                  {participant.name}
                  {participant.isHost && (
                    <span className="text-xs ml-1" style={{ color: colors.primary }}>(Host)</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {participant.isHost ? (
                <Crown size={14} style={{ color: colors.primary }} />
              ) : (
                <Headphones size={14} style={{ color: colors.text.muted }} />
              )}
              {participant.isSpeaking ? (
                <Mic size={14} style={{ color: colors.status.success }} />
              ) : (
                <MicOff size={14} style={{ color: colors.text.muted }} />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${colors.text.muted}10;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${colors.text.muted}30;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${colors.text.muted}50;
        }
      `}</style>
    </div>
  );
};