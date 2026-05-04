import { useState } from 'react';
import { wsService } from '@/services/websocket.service';
import { useAuth } from '@/contexts/AuthContext';

export const useAddMedia = (roomId: string) => {
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  const addToPlaylist = async (item: any) => {
    setIsAdding(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      
      if (data.success) {
        wsService.send('playlist:add', {
          roomId,
          item: data.item,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add to playlist:', error);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  return { isAdding, addToPlaylist };
};