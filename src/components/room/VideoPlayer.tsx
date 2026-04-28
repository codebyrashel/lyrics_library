'use client';

import { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, RotateCcw, RotateCw } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';

export const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const colors = getColors();
  const {
    currentPlaying,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    volume,
    isMuted,
    setIsMuted,
    playbackRate,
    setPlaybackRate,
    duration,
    setDuration,
    playNext,
    playPrevious,
    queue,
    history
  } = useRoomStore();

  const hasNext = queue.length > 0;
  const hasPrevious = history.length > 0;

  // Sync video state with store
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentPlaying || currentPlaying.type !== 'local') return;
    
    if (isPlaying) {
      video.play();
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
    setIsPlaying(!isPlaying);
  };

  const handleSeekBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSeekForward = () => {
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
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
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
        setIsPlaying(true);
        break;
      case 'pause':
        setIsPlaying(false);
        break;
      case 'timeupdate':
        setCurrentTime(video.currentTime);
        break;
      case 'loadedmetadata':
        setDuration(video.duration);
        break;
      case 'ended':
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
        <p style={{ color: colors.text.muted }}>No media playing. Add something to the queue!</p>
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
        
        {/* Next/Prev Controls for YouTube */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={playPrevious}
            disabled={!hasPrevious}
            className={`p-2 rounded-lg transition-colors ${!hasPrevious ? 'opacity-30 cursor-not-allowed' : ''}`}
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) => {
              if (hasPrevious) e.currentTarget.style.backgroundColor = `${colors.text.muted}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={playNext}
            disabled={!hasNext}
            className={`p-2 rounded-lg transition-colors ${!hasNext ? 'opacity-30 cursor-not-allowed' : ''}`}
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) => {
              if (hasNext) e.currentTarget.style.backgroundColor = `${colors.text.muted}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Local Video Player with Full Controls
  return (
    <div className="space-y-3">
      <video
        ref={videoRef}
        src={currentPlaying.url}
        className="w-full aspect-video rounded-xl"
        onPlay={() => handleVideoEvent('play')}
        onPause={() => handleVideoEvent('pause')}
        onTimeUpdate={() => handleVideoEvent('timeupdate')}
        onLoadedMetadata={() => handleVideoEvent('loadedmetadata')}
        onEnded={() => handleVideoEvent('ended')}
      />
      
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: colors.text.muted }}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
          className="flex-1 h-1 rounded-lg cursor-pointer"
          style={{ accentColor: colors.primary }}
        />
        <span className="text-xs" style={{ color: colors.text.muted }}>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handleSeekBackward}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.text.muted}10`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RotateCcw size={18} />
          </button>
          
          <button
            onClick={playPrevious}
            disabled={!hasPrevious}
            className={`p-2 rounded-lg ${!hasPrevious ? 'opacity-30 cursor-not-allowed' : ''}`}
            style={{ color: colors.text.secondary }}
          >
            <SkipBack size={18} />
          </button>
          
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-lg transition-opacity"
            style={{ backgroundColor: colors.primary, color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={playNext}
            disabled={!hasNext}
            className={`p-2 rounded-lg ${!hasNext ? 'opacity-30 cursor-not-allowed' : ''}`}
            style={{ color: colors.text.secondary }}
          >
            <SkipForward size={18} />
          </button>
          
          <button
            onClick={handleSeekForward}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.text.muted}10`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <RotateCw size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.text.muted}10`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
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
            className="px-2 py-1 rounded-lg text-xs font-medium"
            style={{ color: colors.primary, backgroundColor: `${colors.primary}10` }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}20`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${colors.primary}10`}
          >
            {playbackRate}x
          </button>
          
          <button
            onClick={() => document.documentElement.requestFullscreen()}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.text.muted}10`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};