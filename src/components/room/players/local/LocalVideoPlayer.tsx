'use client';

import { useRef, useEffect, useState } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { wsService } from '@/services/websocket.service';
import { LocalControls } from './LocalControls';

interface LocalVideoPlayerProps {
  roomId: string;
}

export const LocalVideoPlayer = ({ roomId }: LocalVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false); // Prevent feedback loops
  
  const currentPlaying = useRoomStore((state) => state.currentPlaying);
  const isPlaying = useRoomStore((state) => state.isPlaying);
  const setIsPlaying = useRoomStore((state) => state.setPlaying);
  const currentTime = useRoomStore((state) => state.currentTime);
  const setCurrentTime = useRoomStore((state) => state.setCurrentTime);
  const volume = useRoomStore((state) => state.volume);
  const isMuted = useRoomStore((state) => state.isMuted);
  const playbackRate = useRoomStore((state) => state.playbackRate);
  const setDuration = useRoomStore((state) => state.setDuration);
  const playNext = useRoomStore((state) => state.playNext);
  const duration = useRoomStore((state) => state.duration);

  const showControlsWithTimeout = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
    setControlsTimeout(timeout);
  };

  // Sync video with store (for local actions)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentPlaying) return;
    
    if (isPlaying) {
      video.play().catch(e => console.log('Play error:', e));
    } else {
      video.pause();
    }
  }, [isPlaying, currentPlaying]);

  // Sync time position from store (when seeking from other users)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentPlaying) return;
    if (isSyncingRef.current) return;
    
    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      isSyncingRef.current = true;
      video.currentTime = currentTime;
      setTimeout(() => { isSyncingRef.current = false; }, 100);
    }
  }, [currentTime, currentPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    // Broadcast to room
    wsService.send('playback:playpause', {
      roomId,
      isPlaying: newPlayingState,
    });
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (videoRef.current) videoRef.current.currentTime = time;
    
    // Broadcast to room
    wsService.send('playback:seek', {
      roomId,
      currentTime: time,
    });
  };

  const handleSeekBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    handleSeek(newTime);
  };

  const handleSeekForward = () => {
    const newTime = currentTime + 10;
    handleSeek(newTime);
  };

  const handleVideoEvent = (type: string) => {
    const video = videoRef.current;
    if (!video) return;
    
    switch(type) {
      case 'play':
        if (!isSyncingRef.current) {
          setIsPlaying(true);
          wsService.send('playback:playpause', { roomId, isPlaying: true });
        }
        break;
      case 'pause':
        if (!isSyncingRef.current) {
          setIsPlaying(false);
          wsService.send('playback:playpause', { roomId, isPlaying: false });
        }
        break;
      case 'timeupdate':
        if (!isSyncingRef.current && Math.abs(video.currentTime - currentTime) > 1) {
          setCurrentTime(video.currentTime);
          wsService.send('playback:seek', { roomId, currentTime: video.currentTime });
        }
        break;
      case 'loadedmetadata':
        setDuration(video.duration);
        break;
      case 'ended':
        playNext();
        break;
    }
  };

  // Listen for remote playback events
  useEffect(() => {
    const handleRemotePlayPause = (data: any) => {
      if (data.roomId === roomId && data.userId !== localStorage.getItem('user_id')) {
        isSyncingRef.current = true;
        setIsPlaying(data.isPlaying);
        setTimeout(() => { isSyncingRef.current = false; }, 100);
      }
    };

    const handleRemoteSeek = (data: any) => {
      if (data.roomId === roomId && data.userId !== localStorage.getItem('user_id')) {
        isSyncingRef.current = true;
        setCurrentTime(data.currentTime);
        if (videoRef.current) {
          videoRef.current.currentTime = data.currentTime;
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
  }, [roomId, setIsPlaying, setCurrentTime]);

  if (!currentPlaying) return null;

  return (
    <div 
      ref={containerRef}
      className="relative group"
      onMouseMove={showControlsWithTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={currentPlaying.url}
        className="w-full aspect-video rounded-xl cursor-pointer"
        playsInline
        onPlay={() => handleVideoEvent('play')}
        onPause={() => handleVideoEvent('pause')}
        onTimeUpdate={() => handleVideoEvent('timeupdate')}
        onLoadedMetadata={() => handleVideoEvent('loadedmetadata')}
        onEnded={() => handleVideoEvent('ended')}
        onClick={handlePlayPause}
      />
      
      {(showControls || !isPlaying) && (
        <LocalControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayPause}
          onSeek={handleSeek}
          onSeekBackward={handleSeekBackward}
          onSeekForward={handleSeekForward}
        />
      )}
    </div>
  );
};