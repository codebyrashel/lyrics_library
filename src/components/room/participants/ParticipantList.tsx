import { ParticipantItem } from './ParticipantItem';

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isSpeaking?: boolean;
  avatar?: string;
}

interface ParticipantListProps {
  participants: Participant[];
  currentUser: any;
  colors: any;
}

export const ParticipantList = ({ participants, currentUser, colors }: ParticipantListProps) => {
  if (participants.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: colors.text.muted }}>No participants yet</p>
          <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
            Share the room link to invite others
          </p>
        </div>
        <style jsx>{scrollbarStyles}</style>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
      {participants.map((participant) => (
        <ParticipantItem
          key={participant.id}
          participant={participant}
          isCurrentUser={participant.id === currentUser?.id}
          colors={colors}
        />
      ))}
      <style jsx>{scrollbarStyles}</style>
    </div>
  );
};

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: ${(props: any) => props.colors?.text?.muted}10;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: ${(props: any) => props.colors?.text?.muted}30;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: ${(props: any) => props.colors?.text?.muted}50;
  }
`;