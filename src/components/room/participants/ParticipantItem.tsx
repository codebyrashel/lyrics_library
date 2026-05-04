import Image from 'next/image';
import { Crown, Mic, MicOff, Headphones } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isSpeaking?: boolean;
  avatar?: string;
}

interface ParticipantItemProps {
  participant: Participant;
  isCurrentUser: boolean;
  colors: any;
}

export const ParticipantItem = ({ participant, isCurrentUser, colors }: ParticipantItemProps) => {
  return (
    <div
      className="flex items-center justify-between p-2 rounded-lg transition-colors"
      style={{
        backgroundColor: participant.isSpeaking ? `${colors.primary}15` : colors.background,
        border: participant.isSpeaking ? `1px solid ${colors.primary}30` : 'none'
      }}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <ParticipantAvatar participant={participant} isCurrentUser={isCurrentUser} colors={colors} />
        <ParticipantName participant={participant} isCurrentUser={isCurrentUser} colors={colors} />
      </div>
      <ParticipantStatus participant={participant} colors={colors} isCurrentUser={false} />
    </div>
  );
};

const ParticipantAvatar = ({ participant, isCurrentUser, colors }: ParticipantItemProps) => (
  <div className="relative">
    <div
      className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold text-white shrink-0"
      style={{ backgroundColor: colors.primary }}
    >
      {participant.avatar ? (
        <Image
          src={participant.avatar}
          alt={participant.name}
          className="object-cover"
          width={100}
          height={100}
          unoptimized
        />
      ) : (
        participant.name.charAt(0).toUpperCase()
      )}
    </div>
    {participant.isSpeaking && (
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colors.status.success }} />
    )}
    {isCurrentUser && (
      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
    )}
  </div>
);

const ParticipantName = ({ participant, isCurrentUser, colors }: ParticipantItemProps) => (
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>
      {participant.name}
      {participant.isHost && (
        <span className="text-xs ml-1" style={{ color: colors.primary }}>(Host)</span>
      )}
      {isCurrentUser && (
        <span className="text-xs ml-1" style={{ color: colors.text.muted }}>(You)</span>
      )}
    </p>
  </div>
);

const ParticipantStatus = ({ participant, colors }: ParticipantItemProps) => (
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