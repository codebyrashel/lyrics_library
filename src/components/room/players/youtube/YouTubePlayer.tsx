'use client';

import YouTube from 'react-youtube';
import { SkipBack, SkipForward } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';
import { NowPlayingInfo } from '../shared/NowPlayingInfo';

export const YouTubePlayer = () => {
  const colors = getColors();
  const currentPlaying = useRoomStore((state) => state.currentPlaying);
  const playNext = useRoomStore((state) => state.playNext);
  const playPrevious = useRoomStore((state) => state.playPrevious);
  const playlist = useRoomStore((state) => state.playlist);
  const currentIndex = useRoomStore((state) => state.currentIndex);

  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0;

  if (!currentPlaying || currentPlaying.type !== 'youtube') return null;

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
        <NowPlayingInfo currentPlaying={currentPlaying} />
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
};