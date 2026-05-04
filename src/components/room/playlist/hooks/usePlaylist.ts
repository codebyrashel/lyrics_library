import { useState, useEffect } from 'react';
import { wsService } from '@/services/websocket.service';
import { arrayMove } from '@dnd-kit/sortable';

interface PlaylistItem {
  id: string;
  title: string;
  type: 'local' | 'youtube';
  url?: string;
  videoId?: string;
  addedBy: string;
  addedByName: string;
  addedAt: string;
  order: number;
}

export const usePlaylist = (roomId: string) => {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlaylist = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/playlist`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      const data = await response.json();
      if (data.success && data.playlist) {
        setPlaylist(data.playlist);
      } else {
        setPlaylist([]);
      }
    } catch (error) {
      console.error('Failed to load playlist:', error);
      setPlaylist([]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromPlaylist = async (id: string) => {
    try {
      await fetch(`http://localhost:8080/api/rooms/${roomId}/playlist/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const reorderPlaylist = async (startIndex: number, endIndex: number) => {
    const newPlaylist = arrayMove(playlist, startIndex, endIndex);
    setPlaylist(newPlaylist);
    
    try {
      await fetch(`http://localhost:8080/api/rooms/${roomId}/playlist/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ items: newPlaylist.map((item, idx) => ({ id: item.id, order: idx })) }),
      });
    } catch (error) {
      console.error('Failed to reorder playlist:', error);
      loadPlaylist();
    }
  };

  const clearPlaylist = async () => {
    try {
      await fetch(`http://localhost:8080/api/rooms/${roomId}/playlist`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
    } catch (error) {
      console.error('Failed to clear playlist:', error);
    }
  };

  useEffect(() => {
    const handlePlaylistUpdate = (data: any) => {
      if (data.playlist) setPlaylist(data.playlist);
    };

    const handleItemAdded = (data: any) => {
      if (data.item) setPlaylist(prev => [...prev, data.item]);
    };

    const handleItemRemoved = (data: any) => {
      setPlaylist(prev => prev.filter(item => item.id !== data.itemId));
    };

    const handlePlaylistReordered = (data: any) => {
      if (data.playlist) setPlaylist(data.playlist);
    };

    wsService.on('playlist:update', handlePlaylistUpdate);
    wsService.on('playlist:add', handleItemAdded);
    wsService.on('playlist:remove', handleItemRemoved);
    wsService.on('playlist:reorder', handlePlaylistReordered);

    return () => {
      wsService.off('playlist:update', handlePlaylistUpdate);
      wsService.off('playlist:add', handleItemAdded);
      wsService.off('playlist:remove', handleItemRemoved);
      wsService.off('playlist:reorder', handlePlaylistReordered);
    };
  }, [roomId]);

  return { playlist, isLoading, loadPlaylist, removeFromPlaylist, reorderPlaylist, clearPlaylist };
};