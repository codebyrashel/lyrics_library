import { useState } from 'react';
import { wsService } from '@/services/websocket.service';
import { useAuth } from '@/contexts/AuthContext';
import { guestService } from '@/services/guest.service';
import { useRoomStore } from '@/store/roomStore';

export const useAddMedia = (roomId: string) => {
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();
  const isGuest = guestService.isGuest();
  const addToPlaylistStore = useRoomStore((state) => state.addToPlaylist);

  const addToPlaylist = async (item: any) => {
    setIsAdding(true);
    
    // Generate unique ID and add to store immediately for optimistic UI
    const newItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    
    console.log('[useAddMedia] Optimistically adding to store:', newItem);
    
    // Immediately update UI
    addToPlaylistStore(newItem);
    
    try {
      const token = localStorage.getItem('auth_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('[useAddMedia] Using auth token');
      } else {
        const guestId = guestService.getGuestId();
        headers['X-Guest-ID'] = guestId;
        console.log('[useAddMedia] Using guest ID:', guestId);
      }
      
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/playlist`, {
        method: 'POST',
        headers,
        body: JSON.stringify(item),
      });
      
      const data = await response.json();
      console.log('[useAddMedia] Server response:', data);
      
      if (data.success) {
        console.log('[useAddMedia] Server success, sending WebSocket message');
        wsService.send('playlist:add', {
          roomId,
          item: data.item,
        });
        return true;
      } else {
        console.error('[useAddMedia] Server failed:', data.message);
        // Remove the optimistically added item if server failed
        // You'll need a removeFromPlaylist function
        return false;
      }
    } catch (error) {
      console.error('[useAddMedia] Failed to add to playlist:', error);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  return { isAdding, addToPlaylist };
};