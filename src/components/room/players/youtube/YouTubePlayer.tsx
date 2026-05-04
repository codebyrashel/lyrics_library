'use client';

import { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { SkipBack, SkipForward } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';
import { wsService } from '@/services/websocket.service';
import { NowPlayingInfo } from '../shared/NowPlayingInfo';

interface YouTubePlayerProps {
  roomId: string;
}

export const YouTubePlayer = ({ roomId }: YouTubePlayerProps) => {
  const colors = getColors();
  const playerRef = useRef<any>(null);
  const isSyncingRef = useRef(false);
  
  const currentPlaying = useRoomStore((state) => state.currentPlaying);
  const playNext = useRoomStore((state) => state.playNext);
  const playPrevious = useRoomStore((state) => state.playPrevious);
  const setIsPlaying = useRoomStore((state) => state.setPlaying);
  const setCurrentTime = useRoomStore((state) => state.setCurrentTime);
  const playlist = useRoomStore((state) => state.playlist);
  const currentIndex = useRoomStore((state) => state.currentIndex);

  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0;

  // Listen for remote playback events
  useEffect(() => {
    const handleRemotePlayPause = (data: any) => {
      if (data.roomId === roomId && data.userId !== localStorage.getItem('user_id')) {
        isSyncingRef.current = true;
        if (playerRef.current) {
          if (data.isPlaying) {
            playerRef.current.playVideo();
          } else {
            playerRef.current.pauseVideo();
          }
        }
        setTimeout(() => { isSyncingRef.current = false; }, 100);
      }
    };

    const handleRemoteSeek = (data: any) => {
      if (data.roomId === roomId && data.userId !== localStorage.getItem('user_id')) {
        isSyncingRef.current = true;
        if (playerRef.current) {
          playerRef.current.seekTo(data.currentTime, true);
        }
        setTimeout(() => { isSyncingRef.current = false; }, 100);
      }
    };

    wsService.on('playback:playpause', handleRemotePlayPause);
    wsService.on('playback:seek', handleRemoteSeek);

    return () => {
      wsService.off('playback:playpause', handleRemotePlayPause);
      wsService.off('playback:seek', handleRemoteSeek);
    };
  }, [roomId]);

  const onPlayerStateChange = (event: any) => {
    if (isSyncingRef.current) return;
    
    const state = event.data;
    if (state === 1) { // Playing
      wsService.send('playback:playpause', { roomId, isPlaying: true });
      setIsPlaying(true);
    } else if (state === 2) { // Paused
      wsService.send('playback:playpause', { roomId, isPlaying: false });
      setIsPlaying(false);
    }
  };

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
  };

  const handlePlayNext = () => {
    playNext();
    wsService.send('playlist:play', { roomId });
  };

  const handlePlayPrevious = () => {
    playPrevious();
    wsService.send('playlist:play', { roomId });
  };

  if (!currentPlaying || currentPlaying.type !== 'youtube') return null;

  return (
    <div className="space-y-3">
      <YouTube
        videoId={currentPlaying.videoId}
        opts={{ 
          width: '100%', 
          height: '100%', 
          playerVars: { 
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0
          } 
        }}
        className="aspect-video rounded-xl"
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        onEnd={() => playNext()}
      />
      
      <div className="flex items-center justify-between">
        <NowPlayingInfo currentPlaying={currentPlaying} />
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPrevious}
            disabled={!hasPrevious}
            className={`p-2 rounded-lg transition-colors ${!hasPrevious ? 'opacity-30 cursor-not-allowed' : ''} hover:bg-black/5`}
            style={{ color: colors.text.secondary }}
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={handlePlayNext}
            disabled={!hasNext}
            className={`p-2 rounded-lg transition-colors ${!hasNext ? 'opacity-30 cursor-not-allowed' : ''} hover:bg-black/5`}
            style={{ color: colors.text.secondary }}
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};