'use client';

import { useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useRoomStore } from '@/store/roomStore';
import { NowPlayingInfo } from '../shared/NowPlayingInfo';
import { ProgressBar } from '../shared/ProgressBar';
import { ControlButtons } from '../shared/ControlButtons';

interface LocalControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
}

export const LocalControls = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onSeekBackward,
  onSeekForward
}: LocalControlsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPlaying = useRoomStore((state) => state.currentPlaying);
  const volume = useRoomStore((state) => state.volume);
  const isMuted = useRoomStore((state) => state.isMuted);
  const playbackRate = useRoomStore((state) => state.playbackRate);
  const setVolume = useRoomStore((state) => state.setVolume);
  const setIsMuted = useRoomStore((state) => state.setIsMuted);
  const setPlaybackRate = useRoomStore((state) => state.setPlaybackRate);
  const playNext = useRoomStore((state) => state.playNext);
  const playPrevious = useRoomStore((state) => state.playPrevious);
  const playlist = useRoomStore((state) => state.playlist);
  const currentIndex = useRoomStore((state) => state.currentIndex);

  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleRateChange = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const rateIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(rateIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  if (!currentPlaying) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent rounded-xl flex flex-col justify-between p-4 transition-opacity duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <NowPlayingInfo currentPlaying={currentPlaying} />
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
          onClick={onPlayPause}
          className="p-4 rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-white/30"
        >
          {isPlaying ? <Pause size={32} color="white" /> : <Play size={32} color="white" />}
        </button>
      </div>
      
      {/* Bottom Bar */}
      <div className="space-y-2">
        <ProgressBar currentTime={currentTime} duration={duration} onSeek={onSeek} />
        <ControlButtons
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
          onRateChange={handleRateChange}
          onFullscreen={() => containerRef.current?.requestFullscreen()}
          onSeekBackward={onSeekBackward}
          onSeekForward={onSeekForward}
        />
      </div>
    </div>
  );
};