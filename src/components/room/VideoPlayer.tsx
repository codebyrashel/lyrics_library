'use client';

import { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, RotateCcw, RotateCw } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';

export const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const colors = getColors();
  
  // Get all actions from store
  const currentPlaying = useRoomStore((state) => state.currentPlaying);
  const isPlaying = useRoomStore((state) => state.isPlaying);
  const setIsPlaying = useRoomStore((state) => state.setPlaying);
  const currentTime = useRoomStore((state) => state.currentTime);
  const setCurrentTime = useRoomStore((state) => state.setCurrentTime);
  const volume = useRoomStore((state) => state.volume);
  const setVolume = useRoomStore((state) => state.setVolume);
  const isMuted = useRoomStore((state) => state.isMuted);
  const setIsMuted = useRoomStore((state) => state.setIsMuted);
  const playbackRate = useRoomStore((state) => state.playbackRate);
  const setPlaybackRate = useRoomStore((state) => state.setPlaybackRate);
  const duration = useRoomStore((state) => state.duration);
  const setDuration = useRoomStore((state) => state.setDuration);
  const playNext = useRoomStore((state) => state.playNext);
  const playPrevious = useRoomStore((state) => state.playPrevious);
  const playlist = useRoomStore((state) => state.playlist);
  const currentIndex = useRoomStore((state) => state.currentIndex);

  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0;

  const showControlsWithTimeout = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  const handleMouseMove = () => {
    showControlsWithTimeout();
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
    if (controlsTimeout) clearTimeout(controlsTimeout);
  };

  // Sync video state with store for local files
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentPlaying || currentPlaying.type !== 'local') return;
    
    if (isPlaying) {
      video.play().catch(e => console.log('Play error:', e));
    } else {
      video.pause();
    }
  }, [isPlaying, currentPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentPlaying || currentPlaying.type !== 'local') return;
    
    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
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
    // TODO: Replace with backend sync: emit 'playPause' to room
    setIsPlaying(!isPlaying);
  };

  const handleSeekBackward = () => {
    // TODO: Replace with backend sync: emit 'seek' to room
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSeekForward = () => {
    // TODO: Replace with backend sync: emit 'seek' to room
    setCurrentTime(currentTime + 10);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleRateChange = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const rateIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(rateIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVideoEvent = (type: string) => {
    const video = videoRef.current;
    if (!video) return;
    
    switch(type) {
      case 'play':
        // TODO: Replace with backend sync: emit 'play' to room
        setIsPlaying(true);
        break;
      case 'pause':
        // TODO: Replace with backend sync: emit 'pause' to room
        setIsPlaying(false);
        break;
      case 'timeupdate':
        // TODO: Throttle this for backend sync (only send every 2-3 seconds)
        setCurrentTime(video.currentTime);
        break;
      case 'loadedmetadata':
        setDuration(video.duration);
        break;
      case 'ended':
        // TODO: Replace with backend sync: emit 'next' to room
        playNext();
        break;
    }
  };

  if (!currentPlaying) {
    return (
      <div 
        className="aspect-video rounded-xl flex items-center justify-center"
        style={{ backgroundColor: colors.surface }}
      >
        <p style={{ color: colors.text.muted }}>No media playing. Add something to the watchlist</p>
      </div>
    );
  }

  // YouTube Player
  if (currentPlaying.type === 'youtube' && currentPlaying.videoId) {
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
          onEnd={() => playNext()}
        />
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
              Now Playing: {currentPlaying.title}
            </p>
            <p className="text-xs" style={{ color: colors.text.muted }}>
              Added by {currentPlaying.addedBy}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => playPrevious()}
              disabled={!hasPrevious}
              className={`p-2 rounded-lg transition-colors ${!hasPrevious ? 'opacity-30 cursor-not-allowed' : ''} hover:bg-black/5`}
              style={{ color: colors.text.secondary }}
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={() => playNext()}
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
  }

  // Local Video Player with Overlay Controls
  return (
    <div 
      ref={containerRef}
      className="relative group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={currentPlaying.url}
        className="w-full aspect-video rounded-xl cursor-pointer"
        onPlay={() => handleVideoEvent('play')}
        onPause={() => handleVideoEvent('pause')}
        onTimeUpdate={() => handleVideoEvent('timeupdate')}
        onLoadedMetadata={() => handleVideoEvent('loadedmetadata')}
        onEnded={() => handleVideoEvent('ended')}
        onClick={handlePlayPause}
      />
      
      {/* Overlay Controls */}
      {(showControls || !isPlaying) && (
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl flex flex-col justify-between p-4 transition-opacity duration-300"
        >
          {/* Top Bar - Now Playing Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{currentPlaying.title}</p>
              <p className="text-xs text-white/70">Added by {currentPlaying.addedBy}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playPrevious()}
                disabled={!hasPrevious}
                className={`p-2 rounded-lg transition-colors ${!hasPrevious ? 'opacity-30 cursor-not-allowed' : ''} hover:bg-white/20`}
                style={{ color: 'white' }}
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={() => playNext()}
                disabled={!hasNext}
                className={`p-2 rounded-lg transition-colors ${!hasNext ? 'opacity-30 cursor-not-allowed' : ''} hover:bg-white/20`}
                style={{ color: 'white' }}
              >
                <SkipForward size={20} />
              </button>
            </div>
          </div>
          
          {/* Center - Play/Pause Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="p-4 rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-white/30"
            >
              {isPlaying ? <Pause size={32} color="white" /> : <Play size={32} color="white" />}
            </button>
          </div>
          
          {/* Bottom Bar - Progress and Controls */}
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-white">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value);
                  setCurrentTime(newTime);
                  if (videoRef.current) {
                    videoRef.current.currentTime = newTime;
                  }
                }}
                className="flex-1 h-1 rounded-lg cursor-pointer"
                style={{ accentColor: colors.primary }}
              />
              <span className="text-xs text-white">{formatTime(duration)}</span>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSeekBackward}
                  className="p-2 rounded-lg transition-colors hover:bg-white/20"
                  style={{ color: 'white' }}
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={handleSeekForward}
                  className="p-2 rounded-lg transition-colors hover:bg-white/20"
                  style={{ color: 'white' }}
                >
                  <RotateCw size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg transition-colors hover:bg-white/20"
                  style={{ color: 'white' }}
                >
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 rounded-lg cursor-pointer"
                  style={{ accentColor: colors.primary }}
                />
                
                <button
                  onClick={handleRateChange}
                  className="px-2 py-1 rounded-lg text-xs font-medium hover:bg-white/20"
                  style={{ color: 'white' }}
                >
                  {playbackRate}x
                </button>
                
                <button
                  onClick={() => containerRef.current?.requestFullscreen()}
                  className="p-2 rounded-lg transition-colors hover:bg-white/20"
                  style={{ color: 'white' }}
                >
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};