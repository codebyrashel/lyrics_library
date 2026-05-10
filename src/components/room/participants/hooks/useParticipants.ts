import { useState } from 'react';
import { Participant } from '@/types/participant';

export const useParticipants = (roomId: string) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadParticipants = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        const guestId = localStorage.getItem('guest_session_id');
        if (guestId) {
          headers['X-Guest-ID'] = guestId;
        }
      }
      
      console.log('[useParticipants] Fetching participants for room:', roomId);
      
      const encodedRoomId = encodeURIComponent(roomId);
      const response = await fetch(`http://localhost:8080/api/rooms/${encodedRoomId}/participants`, {
        headers,
      });
      
      console.log('[useParticipants] Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Participants response error:', response.status, errorText);
        setParticipants([]);
        setIsLoading(false);
        return;
      }
      
      const data: { success?: boolean; message?: string; participants?: unknown } = await response.json();
      console.log('[useParticipants] Response data:', data);
      
      if (data.success && Array.isArray(data.participants)) {
        const formattedParticipants: Participant[] = data.participants.map((p: unknown) => {
          const participant = p as Record<string, unknown>;
          return {
            id: ((participant.userId || participant.user_id) as string) || '',
            name: (participant.name as string) || 'User',
            username: (participant.username as string) || `user_${(((participant.userId || participant.user_id) as string) || '').slice(0, 8)}`,
            isHost: (participant.role as string) === 'host',
            role: (participant.role as string) || 'participant',
            avatar: (participant.avatar as string) || undefined,
            joinedAt: (participant.joinedAt as string) || '',
            isGuest: participant.isGuest === true,
            guestName: participant.guestName as string | undefined,
          };
        });
        console.log('[useParticipants] Formatted participants:', formattedParticipants);
        setParticipants(formattedParticipants);
      } else {
        console.log('[useParticipants] No participants or error:', data.message);
        setParticipants([]);
      }
    } catch (error) {
      console.error('[useParticipants] Error loading participants:', error);
      setParticipants([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { participants, isLoading, error, loadParticipants, setParticipants };
};