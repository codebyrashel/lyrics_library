'use client';

import { PlaylistItem } from '@/store/roomStore';
import { getColors } from '@/store/colorStore';

interface NowPlayingInfoProps {
  currentPlaying: PlaylistItem;
}

export const NowPlayingInfo = ({ currentPlaying }: NowPlayingInfoProps) => {
  const colors = getColors();
  
  return (
    <div>
      <p className="text-sm font-medium text-white">{currentPlaying.title}</p>
      <p className="text-xs text-white/70">Added by {currentPlaying.addedBy}</p>
    </div>
  );
};