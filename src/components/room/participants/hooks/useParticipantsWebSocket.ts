import { useEffect } from 'react';
import { wsService } from '@/services/websocket.service';

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isSpeaking?: boolean;
  avatar?: string;
}

export const useParticipantsWebSocket = (
  roomId: string,
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>
) => {
  useEffect(() => {
    const handleParticipantJoined = (data: any) => {
      setParticipants(prev => {
        if (prev.some(p => p.id === data.userId)) return prev;
        return [...prev, {
          id: data.userId,
          name: data.name,
          isHost: data.isHost || false,
          isSpeaking: false,
        }];
      });
    };

    const handleParticipantLeft = (data: any) => {
      setParticipants(prev => prev.filter(p => p.id !== data.userId));
    };

    const handleHostChanged = (data: any) => {
      setParticipants(prev => prev.map(p => ({
        ...p,
        isHost: p.id === data.newHostId,
      })));
    };

    wsService.on('participant_joined', handleParticipantJoined);
    wsService.on('participant_left', handleParticipantLeft);
    wsService.on('host_changed', handleHostChanged);

    return () => {
      wsService.off('participant_joined', handleParticipantJoined);
      wsService.off('participant_left', handleParticipantLeft);
      wsService.off('host_changed', handleHostChanged);
    };
  }, [roomId, setParticipants]);
};