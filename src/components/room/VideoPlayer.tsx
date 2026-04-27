'use client';

import { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoom } from '@/contexts/RoomContext';

export const VideoPlayer = () => {
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const colors = getColors();
  const { currentPlaying, isPlaying, setIsPlaying, currentTime, setCurrentTime } = useRoom();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
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

  return (
    <div className="relative group">
      {currentPlaying.type === 'youtube' && currentPlaying.videoId ? (
        <YouTube
          videoId={currentPlaying.videoId}
          opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1 } }}
          className="aspect-video rounded-xl"
        />
      ) : (
        <video
          ref={videoRef}
          src={currentPlaying.url}
          className="w-full aspect-video rounded-xl"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
      
      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/70 to-transparent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-white hover:scale-105 transition">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={toggleMute} className="text-white hover:scale-105 transition">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 rounded-lg"
            style={{ accentColor: colors.primary }}
          />
          <div className="flex-1" />
          <button className="text-white hover:scale-105 transition">
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};