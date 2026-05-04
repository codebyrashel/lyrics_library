import { useState } from 'react';
import { wsService } from '@/services/websocket.service';

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isSpeaking?: boolean;
  avatar?: string;
}

export const useParticipants = (roomId: string) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadParticipants = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success && data.participants) {
        setParticipants(data.participants);
      } else {
        console.error('Failed to load participants:', data.message);
        setParticipants([]);
      }
    } catch (error) {
      console.error('Error loading participants:', error);
      setParticipants([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { participants, isLoading, loadParticipants, setParticipants };
};