'use client';

import { Trash2, Music, GripVertical, Play, Shuffle, Repeat, Repeat1, Plus } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { useRoomStore } from '@/store/roomStore';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddMedia } from './AddMedia';

interface SortableItemProps {
  item: any;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onRemove: () => void;
}

const SortableItem = ({ item, index, isPlaying, onPlay, onRemove }: SortableItemProps) => {
  const colors = getColors();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isPlaying ? `${colors.primary}15` : colors.background,
    border: isPlaying ? `1px solid ${colors.primary}30` : 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors group"
      onClick={onPlay}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical size={14} className="shrink-0" style={{ color: colors.text.muted }} />
      </div>
      {item.type === 'youtube' ? (
        <Play size={16} className="shrink-0" style={{ color: '#FF0000' }} />
      ) : (
        <Music size={16} className="shrink-0" style={{ color: colors.primary }} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate" style={{ color: colors.text.primary }}>
            {item.title}
          </p>
          {isPlaying && (
            <span 
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
            >
              Playing
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: colors.text.muted }}>
          Added by {item.addedBy} • #{index + 1}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded transition-colors"
        style={{ color: colors.status.error }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export const Playlist = () => {
  const colors = getColors();
  const { 
    playlist, 
    removeFromPlaylist, 
    playItem, 
    reorderPlaylist,
    clearPlaylist,
    playRandom,
    toggleShuffle,
    toggleRepeat,
    isShuffling,
    repeatMode,
    currentPlaying
  } = useRoomStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = playlist.findIndex((item) => item.id === active.id);
      const newIndex = playlist.findIndex((item) => item.id === over?.id);
      reorderPlaylist(oldIndex, newIndex);
    }
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return <Repeat1 size={16} />;
    if (repeatMode === 'all') return <Repeat size={16} />;
    return <Repeat size={16} />;
  };

  return (
    <div 
      className="flex flex-col h-full rounded-xl overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Header with Watchlist title on left and Add Media button on right */}
      <div className="p-3 border-b flex justify-between items-center" style={{ borderColor: `${colors.text.muted}20` }}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold" style={{ color: colors.text.primary }}>
            Watchlist ({playlist.length})
          </h3>
          <div className="flex gap-1">
            <button
              onClick={playRandom}
              className="p-1.5 rounded transition-colors"
              style={{ color: colors.text.secondary }}
              title="Play random"
            >
              <Play size={14} />
            </button>
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded transition-colors ${isShuffling ? 'opacity-100' : 'opacity-50'}`}
              style={{ color: isShuffling ? colors.primary : colors.text.secondary }}
              title="Shuffle"
            >
              <Shuffle size={14} />
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-1.5 rounded transition-colors ${repeatMode !== 'none' ? 'opacity-100' : 'opacity-50'}`}
              style={{ color: repeatMode !== 'none' ? colors.primary : colors.text.secondary }}
              title="Repeat"
            >
              {getRepeatIcon()}
            </button>
            <button
              onClick={clearPlaylist}
              className="p-1.5 rounded transition-colors"
              style={{ color: colors.status.error }}
              title="Clear watchlist"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {/* Add Media Button - Right side of header */}
        <AddMedia />
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {playlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <p className="text-sm" style={{ color: colors.text.muted }}>
              Watchlist is empty
            </p>
            <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
              Click the &quot;Add to Watchlist&quot; button above to add YouTube videos or local files
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={playlist.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {playlist.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    index={index}
                    isPlaying={currentPlaying?.id === item.id}
                    onPlay={() => playItem(item)}
                    onRemove={() => removeFromPlaylist(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};