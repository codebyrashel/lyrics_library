'use client';

import { useRef, useEffect, useState } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { LocalControls } from './LocalControls';

export const LocalVideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
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

  // Don't return early - move the check inside the render
  const showControlsWithTimeout = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentPlaying) return;
    
    if (isPlaying) {
      video.play().catch(e => console.log('Play error:', e));
    } else {
      video.pause();
    }
  }, [isPlaying, currentPlaying]);

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
    setIsPlaying(!isPlaying);
  };

  const handleSeekBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
    if (videoRef.current) videoRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  const handleSeekForward = () => {
    setCurrentTime(currentTime + 10);
    if (videoRef.current) videoRef.current.currentTime = currentTime + 10;
  };

  const handleVideoEvent = (type: string) => {
    const video = videoRef.current;
    if (!video) return;
    
    switch(type) {
      case 'play': setIsPlaying(true); break;
      case 'pause': setIsPlaying(false); break;
      case 'timeupdate': setCurrentTime(video.currentTime); break;
      case 'loadedmetadata': setDuration(video.duration); break;
      case 'ended': playNext(); break;
    }
  };

  // Check if there's no media to play - but don't return early before hooks
  if (!currentPlaying) {
    return null;
  }

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
          onSeek={(time) => {
            setCurrentTime(time);
            if (videoRef.current) videoRef.current.currentTime = time;
          }}
          onSeekBackward={handleSeekBackward}
          onSeekForward={handleSeekForward}
        />
      )}
    </div>
  );
};