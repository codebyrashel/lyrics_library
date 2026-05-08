'use client';

import { useState, useEffect } from 'react';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';
import { wsService } from '@/services/websocket.service';
import { AddMedia } from '../addMedia/AddMedia';
import { PlaylistHeader } from './PlaylistHeader';
import { PlaylistContent } from './PlaylistContent';
import { PlaylistLoading } from './PlaylistLoading';

interface PlaylistProps {
  roomId: string;
}

export const Playlist = ({ roomId }: PlaylistProps) => {
  const colors = getColors();
  const [isLoading, setIsLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  
  // Get playlist from Zustand store
  const playlist = useRoomStore((state) => state.playlist);
  const currentPlaying = useRoomStore((state) => state.currentPlaying);
  const playItem = useRoomStore((state) => state.playItem);
  const removeFromPlaylist = useRoomStore((state) => state.removeFromPlaylist);
  const reorderPlaylist = useRoomStore((state) => state.reorderPlaylist);
  const clearPlaylistStore = useRoomStore((state) => state.clearPlaylist);

  // Load playlist from API on mount and sync with store
  useEffect(() => {
    const loadPlaylistFromApi = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          const guestId = localStorage.getItem('guest_session_id');
          if (guestId) {
            headers['X-Guest-ID'] = guestId;
          }
        }
        
        const response = await fetch(`http://localhost:8080/api/rooms/${roomId}/playlist`, {
          headers,
        });
        const data = await response.json();
        
        if (data.success && data.playlist && data.playlist.length > 0) {
          // Sync API data to store if store is empty
          const currentStorePlaylist = useRoomStore.getState().playlist;
          if (currentStorePlaylist.length === 0) {
            data.playlist.forEach((item: any) => {
              useRoomStore.getState().addToPlaylist(item);
            });
          }
        }
      } catch (error) {
        console.error('Failed to load playlist from API:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPlaylistFromApi();
  }, [roomId]);

  const handlePlayItem = (item: any) => {
    playItem(item);
    wsService.send('playlist:play', {
      roomId,
      itemId: item.id,
    });
  };

  const playRandom = () => {
    if (playlist.length === 0) return;
    const randomIndex = Math.floor(Math.random() * playlist.length);
    handlePlayItem(playlist[randomIndex]);
  };

  const toggleRepeatMode = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleClearPlaylist = () => {
    clearPlaylistStore();
    // Also clear on backend
    fetch(`http://localhost:8080/api/rooms/${roomId}/playlist`, {
      method: 'DELETE',
    }).catch(console.error);
  };

  console.log('[Playlist] Rendering with playlist length:', playlist?.length);

  if (isLoading && playlist.length === 0) {
    return <PlaylistLoading colors={colors} />;
  }

  return (
    <div 
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <PlaylistHeader 
        playlistLength={playlist?.length || 0}
        onPlayRandom={playRandom}
        isShuffling={isShuffling}
        onToggleShuffle={() => setIsShuffling(!isShuffling)}
        repeatMode={repeatMode}
        onToggleRepeat={toggleRepeatMode}
        onClearPlaylist={handleClearPlaylist}
        colors={colors}
      >
        <AddMedia roomId={roomId} />
      </PlaylistHeader>
      
      <PlaylistContent 
        playlist={playlist || []}
        currentPlayingId={currentPlaying?.id}
        onPlayItem={handlePlayItem}
        onRemoveItem={removeFromPlaylist}
        onReorderItems={reorderPlaylist}
        colors={colors}
      />
    </div>
  );
};