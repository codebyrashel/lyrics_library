'use client';

import { Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';
import { getColors } from '@/store/colorStore';

interface ControlButtonsProps {
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRateChange: () => void;
  onFullscreen: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
}

export const ControlButtons = ({
  volume,
  isMuted,
  playbackRate,
  onToggleMute,
  onVolumeChange,
  onRateChange,
  onFullscreen,
  onSeekBackward,
  onSeekForward
}: ControlButtonsProps) => {
  const colors = getColors();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <button
          onClick={onSeekBackward}
          className="p-2 rounded-lg transition-colors hover:bg-white/20"
          style={{ color: 'white' }}
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={onSeekForward}
          className="p-2 rounded-lg transition-colors hover:bg-white/20"
          style={{ color: 'white' }}
        >
          <RotateCw size={16} />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
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
          onChange={onVolumeChange}
          className="w-20 h-1 rounded-lg cursor-pointer"
          style={{ accentColor: colors.primary }}
        />
        
        <button
          onClick={onRateChange}
          className="px-2 py-1 rounded-lg text-xs font-medium hover:bg-white/20"
          style={{ color: 'white' }}
        >
          {playbackRate}x
        </button>
        
        <button
          onClick={onFullscreen}
          className="p-2 rounded-lg transition-colors hover:bg-white/20"
          style={{ color: 'white' }}
        >
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
};