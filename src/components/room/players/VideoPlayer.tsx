'use client';

import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';
import { LocalVideoPlayer } from './local/LocalVideoPlayer';
import { YouTubePlayer } from './youtube/YouTubePlayer';

export const VideoPlayer = () => {
  const colors = getColors();
  const currentPlaying = useRoomStore((state) => state.currentPlaying);

  // Store the player type in a variable instead of conditional return
  const playerType = currentPlaying?.type || null;

  // Render based on type - both components use hooks internally
  // This is fine because both are always rendered in the same order
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

  // Both components are called, but only one returns content
  // This ensures hooks are called in the same order every time
  return (
    <>
      {playerType === 'youtube' && <YouTubePlayer />}
      {playerType === 'local' && <LocalVideoPlayer />}
    </>
  );
};