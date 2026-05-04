import { GripVertical, Play, Music, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlaylistItem {
  id: string;
  title: string;
  type: 'local' | 'youtube';
  addedByName: string;
}

interface SortablePlaylistItemProps {
  item: PlaylistItem;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onRemove: () => void;
  colors: any;
}

export const SortablePlaylistItem = ({ 
  item, index, isPlaying, onPlay, onRemove, colors 
}: SortablePlaylistItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isPlaying ? `${colors.primary}15` : colors.background,
    border: isPlaying ? `1px solid ${colors.primary}30` : 'none',
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group" onClick={onPlay}>
      <DragHandle attributes={attributes} listeners={listeners} colors={colors} />
      <ItemIcon type={item.type} colors={colors} />
      <ItemDetails item={item} index={index} isPlaying={isPlaying} colors={colors} />
      <RemoveButton onRemove={onRemove} colors={colors} />
    </div>
  );
};

const DragHandle = ({ attributes, listeners, colors }: any) => (
  <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
    <GripVertical size={14} className="shrink-0" style={{ color: colors.text.muted }} />
  </div>
);

const ItemIcon = ({ type, colors }: { type: string; colors: any }) => {
  if (type === 'youtube') {
    return <Play size={16} className="shrink-0" style={{ color: '#FF0000' }} />;
  }
  return <Music size={16} className="shrink-0" style={{ color: colors.primary }} />;
};

const ItemDetails = ({ item, index, isPlaying, colors }: any) => (
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>
        {item.title}
      </p>
      {isPlaying && <PlayingBadge colors={colors} />}
    </div>
    <p className="text-xs" style={{ color: colors.text.muted }}>
      Added by {item.addedByName} • #{index + 1}
    </p>
  </div>
);

const PlayingBadge = ({ colors }: { colors: any }) => (
  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
    Playing
  </span>
);

const RemoveButton = ({ onRemove, colors }: { onRemove: () => void; colors: any }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onRemove(); }}
    className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded transition-colors hover:bg-opacity-10"
    style={{ color: colors.status.error }}
  >
    <Trash2 size={14} />
  </button>
);