import { Users } from 'lucide-react';

interface ParticipantHeaderProps {
  participantCount: number;
  colors: any;
}

export const ParticipantHeader = ({ participantCount, colors }: ParticipantHeaderProps) => {
  return (
    <div className="p-3 border-b shrink-0" style={{ borderColor: `${colors.text.muted}20` }}>
      <div className="flex items-center gap-2">
        <Users size={16} style={{ color: colors.primary }} />
        <h3 className="font-semibold" style={{ color: colors.text.primary }}>
          Participants ({participantCount})
        </h3>
      </div>
    </div>
  );
};