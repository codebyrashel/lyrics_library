'use client';

import { getColors } from '@/store/colorStore';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const ProgressBar = ({ currentTime, duration, onSeek }: ProgressBarProps) => {
  const colors = getColors();
  
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

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white">{formatTime(currentTime)}</span>
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="flex-1 h-1 rounded-lg cursor-pointer"
        style={{ accentColor: colors.primary }}
      />
      <span className="text-xs text-white">{formatTime(duration)}</span>
    </div>
  );
};