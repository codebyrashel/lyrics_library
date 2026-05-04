'use client';

import { useState, useEffect } from 'react';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';
import { wsService } from '@/services/websocket.service';
import { AddMedia } from '../addMedia/AddMedia';
import { PlaylistHeader } from './PlaylistHeader';
import { PlaylistContent } from './PlaylistContent';
import { PlaylistLoading } from './PlaylistLoading';
import { usePlaylist } from './hooks/usePlaylist';

interface PlaylistProps {
  roomId: string;
}

export const Playlist = ({ roomId }: PlaylistProps) => {
  const colors = getColors();
  const { playlist, isLoading, loadPlaylist, removeFromPlaylist, reorderPlaylist, clearPlaylist } = usePlaylist(roomId);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const { currentPlaying, playItem: playLocalItem } = useRoomStore();

  useEffect(() => {
    loadPlaylist();
  }, [roomId]);

  const playItem = (item: any) => {
    playLocalItem(item);
    wsService.send('playlist:play', {
      roomId,
      itemId: item.id,
    });
  };

  const playRandom = () => {
    if (playlist.length === 0) return;
    const randomIndex = Math.floor(Math.random() * playlist.length);
    playItem(playlist[randomIndex]);
  };

  const toggleRepeatMode = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  if (isLoading) {
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
        onClearPlaylist={clearPlaylist}
        colors={colors}
      >
        <AddMedia roomId={roomId} />
      </PlaylistHeader>
      
      <PlaylistContent 
        playlist={playlist}
        currentPlayingId={currentPlaying?.id}
        onPlayItem={playItem}
        onRemoveItem={removeFromPlaylist}
        onReorderItems={reorderPlaylist}
        colors={colors}
      />
    </div>
  );
};