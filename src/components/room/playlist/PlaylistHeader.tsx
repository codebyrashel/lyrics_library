import { Play, Shuffle, Repeat, Repeat1, Trash2 } from 'lucide-react';

interface PlaylistHeaderProps {
  playlistLength: number;
  onPlayRandom: () => void;
  isShuffling: boolean;
  onToggleShuffle: () => void;
  repeatMode: 'none' | 'one' | 'all';
  onToggleRepeat: () => void;
  onClearPlaylist: () => void;
  colors: any;
  children: React.ReactNode;
}

export const PlaylistHeader = ({
  playlistLength,
  onPlayRandom,
  isShuffling,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  onClearPlaylist,
  colors,
  children
}: PlaylistHeaderProps) => {
  const getRepeatIcon = () => {
    if (repeatMode === 'one') return <Repeat1 size={14} />;
    return <Repeat size={14} />;
  };

  return (
    <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: `${colors.text.muted}20` }}>
      <div className="flex items-center gap-2">
        <h3 className="font-semibold" style={{ color: colors.text.primary }}>
          Watchlist ({playlistLength})
        </h3>
        <PlaylistControls
          onPlayRandom={onPlayRandom}
          isShuffling={isShuffling}
          onToggleShuffle={onToggleShuffle}
          repeatMode={repeatMode}
          onToggleRepeat={onToggleRepeat}
          getRepeatIcon={getRepeatIcon}
          onClearPlaylist={onClearPlaylist}
          colors={colors}
        />
      </div>
      {children}
    </div>
  );
};

const PlaylistControls = ({ 
  onPlayRandom, isShuffling, onToggleShuffle, 
  repeatMode, onToggleRepeat, getRepeatIcon, onClearPlaylist, colors 
}: any) => (
  <div className="flex gap-1">
    <PlaylistControlButton onClick={onPlayRandom} title="Play random" colors={colors}>
      <Play size={14} />
    </PlaylistControlButton>
    <PlaylistControlButton 
      onClick={onToggleShuffle} 
      title="Shuffle"
      isActive={isShuffling}
      activeColor={colors.primary}
      colors={colors}
    >
      <Shuffle size={14} />
    </PlaylistControlButton>
    <PlaylistControlButton 
      onClick={onToggleRepeat} 
      title="Repeat"
      isActive={repeatMode !== 'none'}
      activeColor={colors.primary}
      colors={colors}
    >
      {getRepeatIcon()}
    </PlaylistControlButton>
    <PlaylistControlButton onClick={onClearPlaylist} title="Clear watchlist" colors={colors} hoverColor={colors.status.error}>
      <Trash2 size={14} />
    </PlaylistControlButton>
  </div>
);

const PlaylistControlButton = ({ onClick, children, title, isActive, activeColor, hoverColor, colors }: any) => (
  <button
    onClick={onClick}
    className="p-1.5 rounded transition-colors hover:bg-opacity-10"
    style={{ 
      color: isActive ? activeColor || colors.primary : colors.text.secondary,
      backgroundColor: isActive ? `${activeColor || colors.primary}10` : 'transparent'
    }}
    title={title}
  >
    {children}
  </button>
);