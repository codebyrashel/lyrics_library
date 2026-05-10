import Image from 'next/image';
import { Crown, Mic, MicOff, Headphones } from 'lucide-react';
import { getGuestAvatarColor, getGuestInitial } from '@/utils/guestNameGenerator';
import { Participant } from '@/types/participant';

interface ParticipantItemProps {
  participant: Participant;
  isCurrentUser: boolean;
  colors: any;
}

export const ParticipantItem = ({ participant, isCurrentUser, colors }: ParticipantItemProps) => {
  // Check if this is a guest participant
  const isGuest = participant.isGuest || participant.id?.startsWith('guest_');
  
  // Use the participant name (backend already returns the generated guest name)
  const displayName = participant.name;
  
  const avatarColor = isGuest ? getGuestAvatarColor(displayName) : colors.primary;
  const initial = isGuest ? getGuestInitial(displayName) : displayName?.charAt(0).toUpperCase();
  
  return (
    <div
      className="flex items-center justify-between p-2 rounded-lg transition-colors"
      style={{
        backgroundColor: participant.isSpeaking ? `${colors.primary}15` : colors.background,
        border: participant.isSpeaking ? `1px solid ${colors.primary}30` : 'none'
      }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <ParticipantAvatar 
          participant={participant}
          displayName={displayName}
          isCurrentUser={isCurrentUser} 
          colors={colors}
          avatarColor={avatarColor}
          initial={initial}
          isGuest={isGuest}
        />
        <ParticipantName 
          participant={participant}
          displayName={displayName}
          isCurrentUser={isCurrentUser} 
          colors={colors}
          isGuest={isGuest}
        />
      </div>
      <ParticipantStatus participant={participant} colors={colors} />
    </div>
  );
};

const ParticipantAvatar = ({ participant, displayName, isCurrentUser, colors, avatarColor, initial, isGuest }: any) => (
  <div className="relative">
    <div
      className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold text-white shrink-0"
      style={{ backgroundColor: avatarColor }}
    >
      {participant.avatar ? (
        <Image
          src={participant.avatar}
          alt={displayName}
          className="object-cover"
          width={100}
          height={100}
          unoptimized
        />
      ) : (
        initial
      )}
    </div>
    {participant.isSpeaking && (
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.status.success }} />
    )}
    {isGuest && !participant.isSpeaking && (
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ backgroundColor: colors.text.muted }} />
    )}
    {isCurrentUser && (
      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
    )}
  </div>
);

const ParticipantName = ({ participant, displayName, isCurrentUser, colors, isGuest }: any) => (
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>
      {displayName}
      {participant.isHost && (
        <span className="text-xs ml-1" style={{ color: colors.primary }}>(Host)</span>
      )}
      {isCurrentUser && (
        <span className="text-xs ml-1" style={{ color: colors.text.muted }}>(You)</span>
      )}
      {isGuest && !isCurrentUser && (
        <span className="text-xs ml-1" style={{ color: colors.text.muted }}>(Guest)</span>
      )}
    </p>
  </div>
);

const ParticipantStatus = ({ participant, colors }: any) => (
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
);